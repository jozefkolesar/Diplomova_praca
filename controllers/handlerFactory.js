const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const APIFeatures = require('../utilities/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Neexistuje žiaden dokument s týmto ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //ked mame patch, tak to meni len zmenene veci v databaze, neocakava cele data zmenene
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      //treti argument = options
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('Neexistuje žiadna tour s týmto ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc, // malo by byť tour: tour, ale v ES6 kd su 2 rovnake tak netreba
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //popOptions = populateOption
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (!doc) {
      return next(new AppError('Neexistuje žiaden dokument s týmto ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //SPUSTIME QUERY

    //NESTED GET recenzie
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query) //vytváram nový objekt classy API Feature
      .filter()
      .sort()
      .limitFields()
      .paginate(); //chaining metód APIFeatures
    const doc = await features.query; //.explain -> štatistiky

    // POSLI RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
