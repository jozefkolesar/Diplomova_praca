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
      new AppError('Žiadne nahlásenie s týmito parametrami nebolo nájdené!'),
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

exports.getAllTeacherReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({ reciever: req.user.name }).sort('status');

  if (!reports) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  }

  res.status(200).json({
    status: 'success',
    data: {
      reports,
    },
  });
});

exports.getAllStudentReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({ user: req.user.id }).sort({ status: -1 }); // sort - zoradenie -> zamietnuta -> nevyriesena -> akceptovana

  if (!reports) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  }

  res.status(200).json({
    status: 'success',
    data: {
      reports,
    },
  });
});

//102
exports.getReportStats = catchAsync(async (req, res) => {
  try {
    // const currentUser = req.user.id;
    const reports = await Report.aggregate([
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
        reports,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
    });
  }
});
