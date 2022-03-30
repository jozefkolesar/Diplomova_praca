const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    //parent referencing na používateľa
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      //required: [true, 'Každé nahlásenie musí mať autora!'],
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
      default: 'nevyriesena',
      enum: {
        values: ['nevyriesena', 'akceptovana', 'neuznana'],
        message:
          'Stav nahlásenia môže nadobúdať len hodnoty: Nevyriešená, Akceptovaná a Neuznaná!',
      },
    },
    photo: String,
    //location: {
    //embeded object
    //GeoJSON
    // type: {
    //   type: String,
    //   default: 'Point',
    //   enum: ['Point'],
    // },
    lat: Number,
    long: Number,
    //},
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
      type: String,
      required: [true, 'Každé nahlásenie musí mať príjemcu!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//MIDDLEWARE //populate - parrent refferencing
reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
