const Faculty = require('../models/facultyModel');
const factory = require('./handlerFactory');

exports.getAllFaculties = factory.getAll(Faculty);
