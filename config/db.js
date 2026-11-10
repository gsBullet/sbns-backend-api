const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      // console.log("✅ MongoDB connected successfully");
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
      process.exit(1);
    });
};

// Graceful disconnect on app shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed (SIGINT)");
  process.exit(0);
});

module.exports = connectDB;
