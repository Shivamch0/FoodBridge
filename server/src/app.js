import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ApiError } from './utils/ApiError.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

app.use('/api/auth', authLimiter, (await import('./routes/auth.routes.js')).default);
app.use('/api/donations', (await import('./routes/donation.routes.js')).default);
app.use('/api/matching', (await import('./routes/matching.routes.js')).default);
app.use('/api/delivery-requests', (await import('./routes/deliveryRequest.routes.js')).default);
app.use('/api/deliveries', (await import('./routes/delivery.routes.js')).default);
app.use('/api/notifications', (await import('./routes/notification.routes.js')).default);

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