
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const requireString = {
  type: String,
  required: true
};
const userSchema = mongoose.Schema(
    {
      name: requireString,
      gender: String,
      dob: Date,
      address: String,
      picURL: String,
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: requireString,
      passwordToken: String,
      passwordExpires: Date,
      userType: {
        type: String,
        require: true,
        default: "client"
      },
      isAdmin: {
        type: Boolean,
        require: true,
        default: false
      },
      isActive: {
        type: Boolean,
        require: true,
        default: false
      },
      ActivationCode: requireString,
      activationExpires: {
        type: Date,
        default: Date.now()
        // expires: 360000,
      }
    },
    {
      toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
          delete ret._id;
          delete ret.userType;
          delete ret.password;
          delete ret.passwordToken;
          delete ret.passwordExpires;
          delete ret.__v;
          return ret;
        }
      },
      timestamps: true
    }
  );

const User = mongoose.model('User', userSchema)

export default User