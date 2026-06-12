// 1. BULLETPROOF ENV LOADER (Must be at the very top)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handling __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env specifically from the server folder
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. IMPORTS
import express from 'express';
import cors from 'cors';
import { sequelize } from './module/index.js'; // Ensure path matches your folder
import apiRoutes from './routes/allRoutes.js';

const app = express();

// 3. MIDDLEWARE
app.use(express.json());
app.use(cors());

// 4. DEBUG LOGS (To confirm variables are loaded)
console.log("-----------------------------------------");
console.log(" SERVER INITIALIZING...");
console.log(" Database Name:", process.env.DB_NAME || "NULL");
console.log(" Database User:", process.env.DB_USER || "NULL");
console.log(" Database Port:", process.env.DB_PORT || "3306");
console.log("-----------------------------------------");

// 5. ROUTES
// All your endpoints (Auth, Announcements, Events, Resources)
app.use('/api', apiRoutes);

// 6. DATABASE SYNC & SERVER START
const APP_PORT = process.env.PORT || 5000;

// Sync database tables automatically
sequelize.sync({  alter: true })
    .then(() => {
        console.log(" MySQL Tables Synced & Connected Successfully");
        app.listen(APP_PORT, () => {
            console.log(` CDAC Connect Server running on http://localhost:${APP_PORT}`);
        });
    })
    .catch(err => {
        console.error(" Database Connection Failed!");
        console.error("Reason:", err.message);
        console.log("\nTIP: Make sure XAMPP/MySQL is running and the database 'cdac_connect' exists.");
    });