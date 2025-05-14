import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
console.log("hello");
app.use('/api/users', userRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
