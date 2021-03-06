const mongoose = require('mongoose');
const Report = require('../models/reportModel');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

//výpis všetkých reportov - development
exports.getAllReports = factory.getAll(Report);

// Vytvorenie nahlásenia
exports.createReport = factory.createOne(Report);

//Výpis jedného z nahlásení
exports.getReport = factory.getOne(Report);

//Možný update nahlásenia
exports.updateReport = factory.updateOne(Report);

//Vymazanie nahlásenia
exports.deleteReport = factory.deleteOne(Report);

//Výpis novo prijatých nahlásení
exports.getNewReports = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const userId = req.user.id;
  const currentTeacher = await User.findById(userId);

  const newReports = await Report.find({
    reciever: currentTeacher.name,
    status: 'nevyriesena',
  });

  if (!newReports || newReports.length === 0) {
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
    next(new AppError('Žiadne nevyriešené nahlásenie nebolo nájdené!'), 400);
  }
});

//Výpis všetkých nahlásení pre prihláseného učiteľa
exports.getAllTeacherReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({
    reciever: { $regex: `${req.user.name}` },
  }).sort({ status: -1 });

  if (!reports || reports.length === 0) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        reports,
      },
    });
  }
});

//Výpis všetkých nahlásení pre prihláseného študenta
exports.getAllStudentReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({ user: req.user.id }).sort({ status: -1 }); // sort - zoradenie ->  accepted -> pending -> denied

  if (!reports || reports.length === 0) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      results: reports.length,
      data: {
        reports,
      },
    });
  }
});

//Štatistiky prijatých nahlásení - učiteľ
exports.getReportStats = catchAsync(async (req, res, next) => {
  const statistics = await Report.aggregate([
    {
      $match: {
        reciever: { $eq: req.user.name },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              _id: 0,
              role: 0,
              faculty: 0,
              password: 0,
              year: 0,
            },
          },
        ],
        as: 'user',
      },
    },
    {
      $group: {
        _id: '$status', //groupovanie reportov podľa statusu
        reports: { $push: '$$ROOT' },
        numberOfReports: { $sum: 1 },
      },
    },

    {
      $addFields: {
        sortField: {
          $cond: [
            { $eq: ['$_id', 'nevyriesena'] },
            0,
            { $cond: [{ $eq: ['$_id', 'akceptovana'] }, 1, 2] },
          ],
        },
      },
    },
    { $sort: { sortField: 1 } },
    { $unset: 'sortId' },
  ]);

  if (!statistics || statistics.length === 0) {
    next(new AppError('Štatistiky nie je možné zobraziť!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        statistics,
      },
    });
  }
});

//Výpis nevyriešených nahlásení
exports.getPendingReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({
    reciever: req.user.name,
    status: 'nevyriesena',
  }).sort({ status: -1 }); // sort - zoradenie ->  akceptovana -> nevyriesena -> neuznana

  if (!reports || reports.length === 0) {
    next(new AppError('Žiadne nové nahlásenie nebolo nájdené!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      results: reports.length,
      data: {
        reports,
      },
    });
  }
});

//Výpis nahlásení podľa zvoleného dátumu
exports.getTeacherReportsByDate = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const parsedDate = JSON.stringify(date).substring(1, 11);

  const reports = await Report.aggregate([
    {
      $match: {
        reciever: { $eq: req.user.name },
      },
    },
    {
      $addFields: {
        onlyDate: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$dayOfAbsence',
          },
        },
      },
    },
    {
      $match: {
        onlyDate: {
          $eq: parsedDate,
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              _id: 0,
              role: 0,
              faculty: 0,
              password: 0,
              year: 0,
            },
          },
        ],
        as: 'user',
      },
    },
    {
      $group: {
        _id: '$status', //groupovanie reportov podľa statusu
        pushed_reports: { $push: '$$ROOT' },
        numberOfReports: { $sum: 1 },
      },
    },

    {
      $addFields: {
        sortField: {
          $cond: [
            { $eq: ['$_id', 'nevyriesena'] },
            0,
            { $cond: [{ $eq: ['$_id', 'akceptovana'] }, 1, 2] },
          ],
        },
      },
    },
    { $sort: { sortField: 1 } },
    { $unset: 'sortId' },
  ]);

  if (!reports || reports.length === 0) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        reports,
      },
    });
  }
});

//Štatistika vlastných nahlásení - študent
exports.getStudentReportsStatistics = catchAsync(async (req, res, next) => {
  const reports = await Report.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $group: {
        _id: { course: '$course', courseType: '$courseType' },
        numberOfAbsences: { $sum: 1 },
        Akceptovaných: {
          $sum: {
            $cond: [{ $eq: ['$status', 'akceptovana'] }, 1, 0],
          },
        },
        Zamietnutých: {
          $sum: {
            $cond: [{ $eq: ['$status', 'neuznana'] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (!reports || reports.length === 0) {
    next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        reports,
      },
    });
  }
});

//Výpis nahlásení - učiteľ, podľa jednotlivých kurzov - predmetov
exports.getTeacherReportsStatisticsByCourse = catchAsync(
  async (req, res, next) => {
    const reports = await Report.aggregate([
      {
        $match: {
          reciever: { $eq: req.user.name },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 0,
                role: 0,
                faculty: 0,
                password: 0,
                year: 0,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $group: {
          _id: { course: '$course', courseType: '$courseType', user: '$user' },
          numberOfAbsences: { $sum: 1 },
          akceptovanych: {
            $sum: {
              $cond: [{ $eq: ['$status', 'akceptovana'] }, 1, 0],
            },
          },
          zamietnutych: {
            $sum: {
              $cond: [{ $eq: ['$status', 'neuznana'] }, 1, 0],
            },
          },
        },
      },
    ]);

    if (!reports || reports.length === 0) {
      next(new AppError('Žiadne nahlásenie nebolo nájdené!'), 400);
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          reports,
        },
      });
    }
  }
);

//Získanie počtu nových nevyriešených nahlásení - učiteľ
exports.getNumberOfPendingReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({
    reciever: req.user.name,
    status: 'nevyriesena',
  });

  res.status(200).json({
    status: 'success',
    results: reports.length,
  });
});
