import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String
});

const userSchema = new mongoose.Schema({
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  fullName:       { type: String },
  dateOfBirth:    { type: Date },
  gender:         { type: String, enum: ['Male', 'Female', 'Other'] },
  mobile:         { type: String, unique: true, sparse: true },
  aadharNumber:   { type: String, unique: true, sparse: true },
  abhaHealthId:   { type: String, unique: true, sparse: true },
  nationality:    { type: String },
  preferredLanguage: { type: String },
  maritalStatus:  { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  occupation:     { type: String },
  ruralOrUrban:   { type: String, enum: ['Rural', 'Urban'] },
  address:        { type: addressSchema },
  emergencyContact: { type: String },

  email:          { type: String, required: true, unique: true },
  password:       { type: String }
}, {
  timestamps: true
});

// Auto-generate full name
userSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
