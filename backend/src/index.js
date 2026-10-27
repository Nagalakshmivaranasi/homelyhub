import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './utils/db.js';
import {router} from "./routes/userRoutes.js";
import { propertyRouter } from './routes/propertyRouter.js';
import { bookingRouter } from './routes/bookingRouter.js';

// dotenv.config({path: './config/config.env'});
dotenv.config();
const app = express();

// express.json() middleware to parse incoming JSON requests
app.use(express.json({limit: '100mb'}));

// urlencoded middleware to parse incoming URL-encoded requests
app.use(express.urlencoded({extended:true, limit: '100mb'}));

// cookieparser
app.use(cookieParser());

app.use(cors());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('server is running...');
});

app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent", propertyRouter);
app.use("/api/v1/rent/user/booking", bookingRouter);

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();