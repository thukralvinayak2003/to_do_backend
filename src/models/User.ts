import mongoose, { Document } from "mongoose";
import express from "express";
import * as bcrypt from "bcrypt";

export interface userType extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<userType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next: express.NextFunction) {
  //ONly run this function if the password field is modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); // 12 here means how much cpu intensive the encryption should be more the number better the encryption and more cpu intensive it is means more time to encrypt
  this.passwordConfirm = undefined; // to remove the confirm password from the database
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model<userType>("User", userSchema);
