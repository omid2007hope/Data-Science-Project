const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

console.log("MONGO_URI set:", Boolean(process.env.MONGO_URI));

module.exports = connectDB;

// MongoDB connection setup using Mongoose
