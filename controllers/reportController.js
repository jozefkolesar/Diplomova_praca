const Report = require('../models/reportModel');
//const User = require('../models/userModel');
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

exports.getAllReports = factory.getAll(Report);

exports.createReport = factory.createOne(Report);

exports.getReport = factory.getOne(Report /*,{ path: 'reviews' }*/);

exports.updateReport = factory.updateOne(Report);

exports.deleteReport = factory.deleteOne(Report);

exports.getNewReports = catchAsync(async (req, res, next) => {
  //   const currentTeacher = req.user.id;
  //   console.log(currentTeacher);

  const newReports = await Report.find({
    reciever: req.user.id, //zmenit za req.user.id
    status: 'nevyriesena',
  });
  console.log(res.local.user);

  if (!newReports) {
    next(
      new AppError('Neexistuje žiaden dokument s nevyriešeným statusom'),
      400
    );
  }

  res.status(200).json({
    status: 'success',
    results: newReports.length,
    data: {
      data: newReports,
    },
  });
});

//102
exports.getReportStats = catchAsync(async (req, res) => {
  try {
    // const currentUser = req.user.id;
    const reporty = await Report.aggregate([
      // {
      //   $match: { user: { $eq: currentUser } },
      // },
      {
        $group: {
          _id: '$status', //groupovanie reportov podľa statusu
          numberOfReports: { $sum: 1 },
        },
      },
      {
        $sort: { numberOfReports: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        reporty,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
    });
  }
});
