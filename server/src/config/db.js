import mongoose from 'mongoose';
import { DB_NAME } from '../contant.js';
import dns from 'dns';

dns.setServers(['1.1.1.1' , '8.8.8.8'])

export const connectDB = async () => {
    try {
        const connection  = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log("Database connected successfully...")
    } catch (error) {
        console.log("Database connection falied..." , error)
    }
}