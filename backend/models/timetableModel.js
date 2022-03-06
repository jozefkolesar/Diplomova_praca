const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    course: {
      type: String,
    },
    semester: {
      type: String,
      enum: {
        values: ['ZS', 'LS'],
      },
    },
    year: {
      type: Number,
      min: [1, 'Rok dochádzky na vysokú školu môže byť len vo forme 1 - 5'],
      max: [5, 'Rok dochádzky na vysokú školu môže byť len vo forme 1 - 5'],
    },

    lecturer: {
      type: String,
      //trim: true,
    },
    cviciaci: {
      //pedagog - prijímateľ
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//MIDDLEWARE //populate - parrent refferencing
// reportSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//     select: 'name email',
//   });
//   next();
// });

const TimeTable = mongoose.model('Timetable', timetableSchema);
module.exports = TimeTable;
