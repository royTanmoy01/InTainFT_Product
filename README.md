# InTainFT_Product


Intain PoC Challenge: Personal Spending
Intelligence Platform
Problem Statement
You're tasked with building a Personal Spending Intelligence Dashboard that
aggregates payment data from multiple sources and provides users with intelligent
insights about their spending patterns, merchant preferences, and financial behavior. Core Requirements
1. Data Integration Layer  Integrate with 2 different data sources:

o Razorpay Payment APIs (sandbox mode) - for transaction and payment
data
o Google Places API - for merchant categorization and location intelligence
o Data Flow: Use Razorpay transaction data → Enrich with Google Places
merchant details → Generate spending insights

2. Backend Architecture
 Build a REST API that handles:
o User authentication and authorization
o Secure storage of financial transaction data
o Real-time data synchronization from payment APIs
o Merchant data enrichment and categorization
o Spending pattern analysis and aggregation

3. Frontend Dashboard
 Create a React-based dashboard showing:
o Transaction history with smart categorization
o Spending breakdown by categories (food, transport, entertainment, etc.)
o Geographic spending patterns (location-wise analysis)
o Payment method preferences (UPI vs Card vs Net Banking)
o Spending trends and anomaly detection
o Budget recommendations and alerts

4. Security & Compliance
 Implement OAuth 2.0 for user authentication
 Secure API key management for payment data
 Data encryption for sensitive financial information
 Audit logging for all financial transactions
 PCI-DSS consideration for payment data handling

Technical Constraints
 Tech Stack: React.js, Node.js/Express.js, MongoDB (match your existing skills)  APIs: Use sandbox/demo modes only (no real financial data)  Deployment: Local development environment is sufficient  Time Limit: Complete over the weekend (48-72 hours)
Specific Challenges to Address
1. Data Reliability & Reconciliation Challenge
 Payment APIs may return incomplete merchant information
 Google Places API might not find exact matches for merchant names
 Handle API rate limits and failures gracefully for both services
 Implement fuzzy matching for merchant name normalization
 Validate transaction amounts and detect anomalies
2. Intelligent Categorization Challenge
 Automatically categorize diverse Indian merchants (kirana stores, medical shops, petrol bunks)  Handle ambiguous business types (cafes that are also co-working spaces)  Create meaningful spending categories relevant to Indian context  Deal with inconsistent merchant naming conventions
3. User Experience & Trust Challenge
 Users are extremely sensitive about financial data privacy
 Design trust-building UI elements for spending data
 Handle slow API responses during merchant lookup
 Provide meaningful insights without overwhelming users
 Build confidence in automated categorization accuracy
4. Performance & Scalability Challenge
 Real-time merchant enrichment can be slow
 Implement caching strategies for frequently accessed merchant data
 Optimize API calls to Google Places (costs money)  Design for handling large transaction volumes
 Manage API quotas effectively
5. Business Logic Challenge
 Create meaningful spending insights from raw transaction data
 Detect unusual spending patterns and potential fraud
 Generate personalized budget recommendations
 Handle different payment methods and their implications
 Provide location-based spending intelligence

Detailed Feature Requirements
Core Features (Must Have)
1. Transaction Import: Fetch and store transaction data from Razorpay sandbox
2. Merchant Enrichment: Use Google Places to get business categories and locations
3. Smart Categorization: Automatically categorize transactions (Food, Transport, Shopping, etc.)
4. Spending Dashboard: Visual breakdown of spending by category, time, location
5. Search & Filter: Find transactions by merchant, category, amount, date range
Advanced Features (Should Have)
1. Geographic Analysis: Pin code/area wise spending patterns
2. Payment Method Insights: UPI vs Card vs Net Banking usage patterns
3. Spending Trends: Weekly/monthly spending pattern analysis
4. Budget Tracking: Set and monitor spending budgets by category
5. Anomaly Detection: Flag unusual spending patterns
Bonus Features (Nice to Have)
1. Recurring Payment Detection: Identify subscription and recurring payments
2. Merchant Recommendations: Suggest nearby merchants based on spending
history
3. Export Functionality: Generate spending reports (PDF/Excel)
4. Mobile Responsive: PWA-ready spending dashboard
Sample API Integration Flow
// 1. Fetch transactions from Razorpay
const transactions = await razorpay.payments.all({
from: '2024-07-01',
to: '2024-07-17',
count: 100
});
// 2. Enrich with Google Places data
for (let transaction of transactions) {
const placeDetails = await googlePlaces.findPlace({
input: transaction.description,
inputtype: 'textquery',
fields: 'place_id,name,types,geometry,price_level'
});
// 3. Categorize and store
const category = categorizeTransaction(placeDetails.types);
await saveEnrichedTransaction({
...transaction,
merchant_details: placeDetails,
category: category,
location: placeDetails.geometry
});

}
Bonus Points
 Real-time Features: WebSocket implementation for live transaction updates
 Machine Learning: Advanced categorization using ML algorithms
 Indian Context: Handle regional languages in merchant names
 Testing: Unit tests for categorization logic and financial calculations
 DevOps: Docker containerization with proper environment management  Privacy: Data anonymization techniques for sensitive financial data
Available Resources (Suggested)
 Razorpay Sandbox: Free sandbox environment with comprehensive documentation
 Google Places API: Free tier (SKU: Basic Data, Text Search, Place Details)  Sample Data: Create realistic Indian merchant transaction data
 No restriction on using AI tools for learning APIs, but core logic should
demonstrate your thinking

## PCI-DSS Compliance Notes
- No card data is stored in the database or logs.
- Payment method details are masked in API responses.
- Sensitive fields (email, payment_id) are anonymized before returning to frontend.
- All API keys are managed via environment variables and never exposed to the client.
- Audit logging is enabled for all financial transactions.

## Privacy/Anonymization
- User emails and payment IDs are masked in API responses.
- Anonymization utility is implemented in backend for sensitive fields.
- Data encryption is used for sensitive financial information.