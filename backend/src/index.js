import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import userRoutes from './routes/user.js';
import { auditLogger } from './middleware/auditLogger.js';
import http from 'http';
import setupSocket from './socket.js';

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);


const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
export { io };

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(auditLogger);

// Ensure Passport strategies are registered before initializing
import './config/passport.js';
import passport from 'passport';
app.use(passport.initialize());

// Fix for Codespaces/Proxies: trust first proxy
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('InTainFT Backend Running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
