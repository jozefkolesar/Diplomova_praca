const mongoose = require('mongoose');

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
      values: ['Prednáška', 'Cvičenie', 'Seminár'],
      message:
        'Stav nahlásenia môže nadobúdať len hodnoty: Nevyriešená, Akceptovaná a zamietnutá!',
    },
  },
  status: {
    type: String,
    required: [true, 'Každé nahlásenie musí obsahovať aktuálny stav!'],
    default: 'Nevyriešená',
    enum: {
      values: ['Nevyriešená', 'Akceptovaná', 'Zamietnutá'],
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
    address: String,
    description: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(), //čas kedy bolo vytvorené/odoslané
  },
  quickDecscription: {
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
  newAbsence: {
    type: Boolean,
    default: true,
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
