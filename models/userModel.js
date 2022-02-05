const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  //schéma mongoose - špecifikácia aké dáta bude využívať + validator
  name: {
    type: String,
    required: [true, 'Prosím zadaj meno'],
  },
  email: {
    type: String,
    required: [true, 'Prosím zadaj svoj email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Neplatný email!'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  password: {
    type: String,
    required: [true, 'Prosím zadaj heslo!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Prosím potvrď zadané heslo!'],
    validate: {
      validator: function (el) {
        return el === this.password; //funguje len pri CREATE a SAVE!
      },
      message: 'Heslá nie sú rovnaké!',
    },
  },
  paswwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    active: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //hashovanie hesla
  if (!this.isModified('password')) return next(); //ak nebolo heslo modifikované, preskoč funkciu

  this.password = await bcrypt.hash(this.password, 12); //12- hash salt čim vyššie tým lepšie, hash je async funkcia takže musíme označiť celú funkciu ako async a pridať await, vracia promise
  this.passwordConfirm = undefined; //nepotrebujeme už ďalej ukladať
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next(); //preskočíme ak sa zmenilo heslo alebo dokument je NOVÝ

  this.passwordChangedAt = Date.now() - 1000; //oneskorím o 1000 milisekúnd nakoľko robí problémy keď sa oneskorí generácia Tokenu
  next();
});

userSchema.pre(/^find/, function (next) {
  //regulárny výraz na to aby nie len pri čistom find to fungovalo, ale i pri findandupdate atď
  this.find({ active: { $ne: false } }); //find len tie ktoré sú aktívne účty - teda nie sú neaktívne
  next();
});

//INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //porovnanie správneho a napísaného hesla
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); //parseInt - prehodí nám číslo na INT

    return JWTTimestamp < changedTimestamp; // 100 < 200 = TRUE
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); //vygenerovany token ktorý uložím ako hexadecimal string

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minút

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
