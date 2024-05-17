const mongoose = require("mongoose");
const url =
  "mongodb+srv://killer:killer123@cluster0.kaf0scd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: Unable to connect to MongoDB. ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;

// Debugging output
console.log("Attempting to connect to MongoDB...");
connectDB().catch(console.error);
