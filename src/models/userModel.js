import mongoose from "mongoose";
import bcrypt from "bcrypt";
import RefreshTokenModel from "./refreshTokenModel.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Hash Password before save into database
userSchema.pre("save", async function (next) {
  // hash only if password is updated or modified
  if (!this.isModified("password")) return next();
  const SALT_ROUNDS = 10;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// To comare Password
userSchema.methods.isPasswordCorrect = async function (rawPassword) {
  return await bcrypt.compare(rawPassword, this.password);
};

// Define a pre middleware to remove associated refresh tokens
userSchema.pre("remove", async function (next) {
  try {
    // Remove all refresh tokens associated with this user
    await RefreshTokenModel.deleteMany({ userID: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
