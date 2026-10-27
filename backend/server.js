import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './src/utils/db.js';
import { router } from './src/routes/userRoutes.js';
import { propertyRouter } from './src/routes/propertyRouter.js';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  res.send('server is running...');
});

app.use('/api/v1/rent/user', router);
app.use('/api/v1/rent', propertyRouter);

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