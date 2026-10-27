// configure express and middleware

import express from 'express';
import cors from 'cors';

const app = express(); //client => app => route => response

app.use(cors());
app.use(express.json());

export default app;