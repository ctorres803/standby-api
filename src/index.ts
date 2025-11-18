import app from './app';
import { config } from './config/env';
import prisma from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Start server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`API URL: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
