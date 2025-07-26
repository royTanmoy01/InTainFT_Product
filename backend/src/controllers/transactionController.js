// Clear all transactions for the current user (Demo Reset)
const clearTransactions = async (req, res) => {
  try {
    await Transaction.deleteMany({ user: req.user.id });
    res.json({ message: 'All transactions cleared for user.' });
  } catch (err) {
    res.status(500).json({ message: 'Clear failed', error: err.message });
  }
};
import Transaction from '../models/Transaction.js';
import axios from 'axios';
import Fuse from 'fuse.js';
import { cache } from '../../cache.js';
import mlCategorize from '../../mlCategorizer.js';

// Helper: Fuzzy match merchant name to previous merchants for normalization
const fuzzyNormalizeMerchant = async (userId, merchantName) => {
  const prevTxs = await Transaction.find({ user: userId });
  const fuse = new Fuse(prevTxs, { keys: ['merchant_details.name', 'description'], threshold: 0.3 });
  const result = fuse.search(merchantName);
  if (result.length > 0) {
    return result[0].item.merchant_details?.name || result[0].item.description;
  }
  return merchantName;
};

// Helper: Categorize transaction based on Google Place types
const categorizeTransaction = (types = []) => {
  if (types.includes('restaurant')) return 'Food';
  if (types.includes('supermarket')) return 'Groceries';
  if (types.includes('pharmacy')) return 'Medical';
  if (types.includes('gas_station')) return 'Transport';
  if (types.includes('shopping_mall') || types.includes('store')) return 'Shopping';
  if (types.includes('bank')) return 'Finance';
  if (types.includes('movie_theater')) return 'Entertainment';
  return 'Other';
};


// Import transactions from Razorpay and enrich with Google Places
const importTransactions = async (req, res) => {
  try {
    const { from, to } = req.body;
    const razorpayApiUrl = process.env.RAZORPAY_API_URL || 'https://api.razorpay.com/v1/payments';
    const razorpayRes = await axios.get(razorpayApiUrl, {
      params: { from, to, count: 100 },
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET
      }
    });
    let transactions = razorpayRes.data.items;
    // If no transactions, use mock data for demo
    if (!transactions || transactions.length === 0) {
      transactions = [
        {
          id: 'pay_demo1',
          amount: 150000,
          currency: 'INR',
          method: 'card',
          status: 'captured',
          description: 'Starbucks Coffee',
          created_at: Math.floor(Date.now() / 1000) - 86400 * 2
        },
        {
          id: 'pay_demo2',
          amount: 50000,
          currency: 'INR',
          method: 'upi',
          status: 'captured',
          description: 'Big Bazaar',
          created_at: Math.floor(Date.now() / 1000) - 86400 * 5
        },
        {
          id: 'pay_demo3',
          amount: 200000,
          currency: 'INR',
          method: 'netbanking',
          status: 'captured',
          description: 'Apollo Pharmacy',
          created_at: Math.floor(Date.now() / 1000) - 86400 * 10
        }
      ];
    }
    const enriched = [];
    for (const tx of transactions) {
      // Prevent duplicate imports for the same user/payment_id
      const exists = await Transaction.findOne({ user: req.user.id, payment_id: tx.id });
      if (exists) continue;
      // Fuzzy normalize merchant name
      const normalizedMerchant = await fuzzyNormalizeMerchant(req.user.id, tx.description || tx.notes?.merchant_name || 'Merchant');
      let placeDetails = cache.get(normalizedMerchant);
      if (!placeDetails) {
        try {
          const googlePlacesApiUrl = process.env.GOOGLE_PLACES_API_URL || 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
          const googleRes = await axios.get(googlePlacesApiUrl, {
            params: {
              input: normalizedMerchant,
              inputtype: 'textquery',
              fields: 'place_id,name,types,geometry,price_level',
              key: process.env.GOOGLE_PLACES_API_KEY
            }
          });
          placeDetails = googleRes.data.candidates[0] || {};
          cache.set(normalizedMerchant, placeDetails);
        } catch (e) { placeDetails = {}; }
      }
      // Use ML categorizer for category prediction
      const category = mlCategorize(placeDetails.types);
      // Recurring detection: check if similar merchant/amount exists in last 60 days
      const recurring = await Transaction.findOne({
        user: req.user.id,
        'merchant_details.name': placeDetails.name,
        amount: tx.amount / 100,
        created_at: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
      });
      enriched.push(await Transaction.create({
        user: req.user.id,
        payment_id: tx.id,
        amount: tx.amount / 100,
        currency: tx.currency,
        method: tx.method,
        status: tx.status,
        description: tx.description,
        created_at: new Date(tx.created_at * 1000),
        merchant_details: placeDetails,
        category,
        location: placeDetails.geometry,
        isRecurring: !!recurring,
        anomaly: false
      }));
    }
    res.json({ message: 'Imported', count: enriched.length });
  } catch (err) {
    res.status(500).json({ message: 'Import failed', error: err.message });
  }
};

// Merchant recommendations based on top categories/merchants
const getRecommendations = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id });
    const merchantCounts = {};
    for (const tx of txs) {
      const name = tx.merchant_details?.name || tx.description;
      merchantCounts[name] = (merchantCounts[name] || 0) + 1;
    }
    const topMerchants = Object.entries(merchantCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
    res.json({ recommendations: topMerchants });
  } catch (err) {
    res.status(500).json({ message: 'Recommendation failed', error: err.message });
  }
};

// Get all transactions for user (with search/filter)
const getTransactions = async (req, res) => {
  try {
    const { category, min, max, merchant, from, to } = req.query;
    let query = { user: req.user.id };
    if (category) query.category = category;
    if (min || max) query.amount = {};
    if (min) query.amount.$gte = Number(min);
    if (max) query.amount.$lte = Number(max);
    if (from || to) query.created_at = {};
    if (from) query.created_at.$gte = new Date(from);
    if (to) query.created_at.$lte = new Date(to);
    let txs = await Transaction.find(query).sort({ created_at: -1 });
    if (merchant) {
      const fuse = new Fuse(txs, { keys: ['merchant_details.name', 'description'], threshold: 0.4 });
      txs = fuse.search(merchant).map(r => r.item);
    }
    import('../../privacy.js').then(({default: maskSensitive}) => {
      res.json(txs.map(maskSensitive));
    });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Analyze spending (breakdown, trends, anomaly detection)
const analyzeSpending = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id });
    const byCategory = {};
    const byMonth = {};
    let total = 0;
    for (const tx of txs) {
      total += tx.amount;
      byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
      const month = tx.created_at.toISOString().slice(0,7);
      byMonth[month] = (byMonth[month] || 0) + tx.amount;
    }
    // Simple anomaly: flag tx > 2x avg
    const avg = total / (txs.length || 1);
    const anomalies = txs.filter(tx => tx.amount > 2 * avg);
    res.json({ byCategory, byMonth, total, anomalies });
  } catch (err) {
    res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
};

// Budget tracking (set/get)
let budgets = {};
const setBudget = (req, res) => {
  const { category, amount } = req.body;
  budgets[req.user.id] = budgets[req.user.id] || {};
  budgets[req.user.id][category] = amount;
  res.json({ message: 'Budget set', budgets: budgets[req.user.id] });
};
const getBudget = (req, res) => {
  res.json(budgets[req.user.id] || {});
};

// Export transactions (CSV)
const exportTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id });
    let csv = 'Date,Merchant,Category,Amount,Method,Status\n';
    for (const tx of txs) {
      csv += `${tx.created_at.toISOString()},${tx.merchant_details?.name || ''},${tx.category},${tx.amount},${tx.method},${tx.status}\n`;
    }
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Export failed', error: err.message });
  }
};
// Export all controllers for CommonJS

export {
  clearTransactions,
  importTransactions,
  getRecommendations,
  getTransactions,
  analyzeSpending,
  setBudget,
  getBudget,
  exportTransactions
};
