import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phoneNumber: { type: String, sparse: true },
    aadharNumber: { type: String, unique: true, sparse: true },
    abhaHealthId: { type: String, unique: true, sparse: true },
    nationality: { type: String },
    preferredLanguage: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    occupation: { type: String },
    classification: { type: String, enum: ["Rural", "Urban"] },
    address: { type: addressSchema },
    emergencyContact: { type: String },
    isPhoneVerified: { type: Boolean, default: false },

    email: { type: String, required: true, unique: true },
    password: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate full name before saving
userSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
