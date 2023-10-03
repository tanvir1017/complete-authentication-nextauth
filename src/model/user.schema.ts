import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: Schema.Types.String,
    required: [true, "Name field can't be empty"],
  },
  email: {
    type: Schema.Types.String,
    required: [true, "Email field can't be empty"],
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
    required: [true, "Password field can't be empty"],
    min: 6,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
