import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './module/index.js';
import apiRoutes from './routes/allRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Use Modular Routes
app.use('/api', apiRoutes);

// Sync Database & Start
const APP_PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log("MySQL Tables Synced & Connected Successfully");
        app.listen(APP_PORT, () => {
            console.log(`Node Server running on http://localhost:${APP_PORT}`);
        });
    })
    .catch(err => console.log("Database Error: " + err));