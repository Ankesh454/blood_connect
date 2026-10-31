require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db.js');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    server.on('error', (error) => {
      console.error(`Server failed to listen: ${error.message}`);
      process.exitCode = 1;
    });
  } catch (error) {
    console.error(`Backend startup failed: ${error.message}`);
    process.exitCode = 1;
  }
};

startServer();
