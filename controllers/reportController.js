const Report = require('../models/reportModel');
const User = require('../models/userModel');
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

exports.getAllReports = factory.getAll(Report);

exports.createReport = factory.createOne(Report);

exports.getReport = factory.getOne(Report);

exports.updateReport = factory.updateOne(Report);

exports.deleteReport = factory.deleteOne(Report);

exports.getNewReports = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const userId = req.user.id;
  const currentTeacher = await User.findById(userId);
  console.log(currentTeacher.name);

  const newReports = await Report.find({
    reciever: currentTeacher.name,
    status: 'nevyriesena',
  });

  if (!newReports) {
    next(
      new AppError('Žiaden dokument s týmito parametrami nebol nájdený!'),
      400
    );
  }

  if (newReports.length > 0) {
    res.status(200).json({
      status: 'success',
      results: newReports.length,
      data: {
        newReports,
      },
    });
  } else {
    return console.log('Neexistuje žiadne nevyriešené nahlásenie');
  }
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
