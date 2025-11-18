import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import routes from './routes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
