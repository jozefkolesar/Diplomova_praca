const TimeTable = require('../models/timetableModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

//Funkcia pre získanie aktuálnych predmetov rozvrhu študenta
exports.getStudentCourses = catchAsync(async (req, res, next) => {
  const { year } = req.user;
  const { department } = req.user;
  let semester;

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  //automatické overovania letného a zimného semestra
  const zaciatokZimny = new Date('September 20, 2021 00:00:00');
  const koniecZimny = new Date('February 12, 2022 00:00:00');

  if (today > zaciatokZimny && today < koniecZimny) {
    semester = 'ZS';
  } else {
    semester = 'LS';
  }

  const courses = await TimeTable.find({
    course: department,
    year: year,
    semester: semester,
  });

  if (!courses) {
    next(new AppError('Nebol nájdený žiaden kurz!'), 400);
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        courses,
      },
    });
  }
});

exports.getAllCourses = factory.getAll(TimeTable);
exports.createCourse = factory.createOne(TimeTable);
