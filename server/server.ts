import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import invitationRoutes from './routes/invitation.routes';
import participationRoutes from './routes/participation.routes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
console.log("hello");
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/invitations',invitationRoutes);
app.use('/api/participation', participationRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
