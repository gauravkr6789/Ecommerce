import mongoose from 'mongoose'
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`Database connection error: ${err.message}`);
    process.exit(1); 
  }
};