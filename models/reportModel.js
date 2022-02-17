const mongoose = require('mongoose');
//const User = require('./userModel');

const reportSchema = new mongoose.Schema({
  //parent referencing na používateľa
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Každé nahlásenie musí mať autora!'],
  },
  course: {
    type: String,
  },
  courseType: {
    type: String,
    required: [true, 'Každé nahlásenie musí typ predmetu!'],
    enum: {
      values: ['prednaska', 'cvicenie', 'seminar'],
      message:
        'Nahlásenie môže nadobúdať len hodnoty: "Prednáška", "Cvičenie", "Seminár"',
    },
  },
  status: {
    type: String,
    required: [true, 'Každé nahlásenie musí obsahovať aktuálny stav!'],
    default: 'Nevyriešená',
    enum: {
      values: ['nevyriesena', 'akceptovana', 'Zamietnuta'],
      message:
        'Stav nahlásenia môže nadobúdať len hodnoty: Nevyriešená, Akceptovaná a zamietnutá!',
    },
  },
  photo: String,
  location: {
    //embeded object
    //GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
  },
  createdAt: {
    type: Date,
    default: Date.now(), //čas kedy bolo vytvorené/odoslané
  },
  quickDecs: {
    type: String,
    //možno pridať enum
  },
  description: {
    type: String,
    trim: true,
  },
  dayOfAbsence: Date,
  reciever: {
    //pedagog - prijímateľ
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Každé nahlásenie musí mať príjemcu!'],
  },
});

//MIDDLEWARE //populate - 11.7
reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
