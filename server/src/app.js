import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ApiError } from './utils/ApiError.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.routes.js';
import donationRoutes from './routes/donation.routes.js';
import matchingRoutes from './routes/matching.routes.js';
import deliveryRequestRoutes from './routes/deliveryRequest.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
app.set('trust proxy', 1);

app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5173',
	credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')));

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 50,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: { success: false, message: 'Too many authentication attempts. Try again later.' },
});

app.get('/api/health', (req, res) => {
	res.status(200).json({ success: true, message: 'FoodBridge API is running' });
});

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/delivery-requests', deliveryRequestRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use((req, res, next) => {
	next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 500;
	res.status(statusCode).json({
		success: false,
		message: error.message || 'Internal server error',
		errors: error.errors || [],
	});
});

export default app;