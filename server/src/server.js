import dotenv from 'dotenv'; 
dotenv.config({
    path : '.env'
})
import app from "./app.js";
import { connectDB } from './config/db.js';
import { startReservationCleanup } from './services/reservationCleanup.service.js';
import { validateEnvironment } from './config/environment.js';

const port = process.env.PORT || 4000;
validateEnvironment();

connectDB()
.then(() => {
    app.listen(port , () => {
        console.log("Server is listening on port : " , port)
        startReservationCleanup()
    })
})
.catch((error) => {
    console.error("Something went wrong while connecting the database...", error)
    process.exit(1)
})

