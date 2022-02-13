const Report = require('../models/reportModel');
// const APIFeatures = require('../utils/apiFeatures');
// const catchAsync = require('../utilities/catchAsync');
// const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

exports.getAllReports = factory.getAll(Report);

exports.createReport = factory.createOne(Report);

exports.getReport = factory.getOne(Report /*,{ path: 'reviews' }*/);

exports.updateReport = factory.updateOne(Report);

exports.deleteReport = factory.deleteOne(Report);

exports.getReportByDate = () => {};
