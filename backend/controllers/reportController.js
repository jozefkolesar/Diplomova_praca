const multer = require('multer');
const sharp = require('sharp');
const Report = require('../models/reportModel');
const User = require('../models/userModel');
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Zlý formát súboru! Podporované sú len obrazové formáty',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadReportPhoto = upload.single('photo');

exports.resizeReportPhoto = (req, res, next) => {
  //zmenšenie formatovanie obrazku
  if (!req.file) return next();
  req.file.filename = `report-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(400, null)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/img/reports/${req.file.filename}`);

  next();
};

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
  const reports = await Report.find({ user: req.user.id }).sort({ status: 1 }); // sort - zoradenie ->  akceptovana -> nevyriesena -> zamietnuta

  if (!reports) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  }

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      reports,
    },
  });
});

//102
exports.getReportStats = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const statistics = await Report.aggregate([
    {
      $match: {
        reciever: { $eq: req.user.name },
      },
    },
    {
      $group: {
        _id: '$status', //groupovanie reportov podľa statusu
        numberOfReports: { $sum: 1 },
      },
    },
    {
      $sort: { status: 1, numberOfReports: 1 },
    },
  ]);

  if (!statistics) {
    next(new AppError('Štatistiky nie je možné zobraziť!'), 400);
  }

  res.status(200).json({
    status: 'success',
    data: {
      statistics,
    },
  });
});

exports.getPendingReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({
    reciever: req.user.name,
    status: 'nevyriesena',
  }).sort({ status: 1 }); // sort - zoradenie ->  akceptovana -> nevyriesena -> zamietnuta

  if (!reports) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  }

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      reports,
    },
  });
});
//dorobit handler pre ucitela poriadny ($regex)
