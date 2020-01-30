const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an Email'],
    unique: [true, 'Email is already in use'],
    lower: true,
    validate: [validator.isEmail, 'Please provide a valid Email']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user'
  },
  photo: { type: String, default: 'default.jpg' },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Password does not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// will run before CREATE or SAVE query and This keyword contains the document.

userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();
  // hash the password with salt 10
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //will remove the field from database
});

// chaning the password change property after password reset
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// instance method which is called on document and is avaiable on document
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check for password modification / return false if not modified
userSchema.methods.checkPasswordChanged = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changePasswordTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changePasswordTime; //this will return false and if pssword is changed recently after token issued will return true
  }
  // password is not modfied
  return false;
};

userSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min
  // console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
