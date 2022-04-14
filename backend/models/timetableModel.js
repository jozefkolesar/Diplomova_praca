const mongoose = require('mongoose');

//Schéma vytvorenia rozvrhovej jednotky
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
      type: [String],
    },
    cviciaci: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const TimeTable = mongoose.model('Timetable', timetableSchema);

module.exports = TimeTable;
