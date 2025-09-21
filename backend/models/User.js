const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // For buyers (email login)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, 
    },

    // For sellers (username login)
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, 
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
      default: "buyer",
    },

    phone: {
      type: String,
      trim: true,
    },
    
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Encrypt password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
