import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';

const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5173',
	credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
	res.status(200).json({ success: true, message: 'FoodBridge API is running' });
});

app.use('/api/auth', (await import('./routes/auth.routes.js')).default);
app.use('/api/donations', (await import('./routes/donation.routes.js')).default);
app.use('/api/matching', (await import('./routes/matching.routes.js')).default);

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