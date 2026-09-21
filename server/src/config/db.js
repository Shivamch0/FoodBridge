import mongoose from 'mongoose';
import { DB_NAME } from '../contant.js';
import dns from 'dns';

dns.setServers(['1.1.1.1' , '8.8.8.8'])

export const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUrl) throw new Error('MONGO_URL or MONGO_URI is required');

    const connectionString = process.env.MONGO_URI
        ? mongoUrl
        : `${mongoUrl.replace(/\/$/, '')}/${DB_NAME}`;
    await mongoose.connect(connectionString);
    console.log("Database connected successfully...");
}