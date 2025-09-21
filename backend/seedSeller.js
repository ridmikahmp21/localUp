const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // check if seller already exists
    const existingSeller = await User.findOne({ role: "seller" });
    if (existingSeller) {
      console.log("Seller already exists:", existingSeller.username);
    } else {
      const hashedPassword = await bcrypt.hash("123456", 10);

      const seller = await User.create({
        name: "Admin Seller",
        username: "selleradmin",  
        password: "123456", 
        role: "seller",
      });

      console.log("Seller created successfully:");
      console.log("Username:", seller.username);
      console.log("Password: 123456");
    }

    mongoose.disconnect();
  })
  .catch(err => console.error("Error:", err));
