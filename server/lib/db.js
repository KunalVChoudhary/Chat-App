import mongoose from 'mongoose';
import 'dotenv/config'

const connectDB = async () => {
  try {
    mongoose.connection.once('connected', () => {
      console.log('MongoDB connection established');
    });
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;