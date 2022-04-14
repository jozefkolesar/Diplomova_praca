const mongoose = require('mongoose');

//Schéma pridávania nových Fakúlt do app
const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    faculties: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Report = mongoose.model('Faculty', facultySchema);

module.exports = Report;
