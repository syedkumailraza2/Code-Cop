import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: { type: Number, unique: true, required: true },
  username: { type: String, required: true },
  displayName: { type: String },
  avatarUrl: { type: String },
  email: { type: String },
  accessToken: { type: String },
  accessTokenIv: { type: String },
  accessTokenTag: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const User = mongoose.model("User", userSchema);

export default User;
