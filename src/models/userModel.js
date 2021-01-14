
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const requireString = {
  type: String,
  required: true
};
const userSchema = mongoose.Schema(
    {
      names: requireString,
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
      isActive: {
        type: Boolean,
        require: true,
        default: true
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

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User