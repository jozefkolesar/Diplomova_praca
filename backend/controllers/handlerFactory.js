const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const APIFeatures = require('../utilities/apiFeatures');

//Mazanie jedného dokumentu podľa modelu
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

//Update jedného dokumentu podľa modelu
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model.modelName === 'Report') {
      if (req.user.role === 'student') delete req.body.status;
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

//Vytvorenie nového dokumentu podľa modelu
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model.modelName === 'Report') {
      req.body.user = req.user.id;
    }
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

//Výber jedného dokumentu podľa modelu a jeho populate ostatnými poliami
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //popOptions = populateOption
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

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

//Výber všetkých dokumentov podľa modelu
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.reportId) filter = { report: req.params.reportId };

    const features = new APIFeatures(Model.find(filter), req.query) //nový objekt classy API Feature
      .filter()
      .sort()
      .limitFields()
      .paginate(); //chaining metód APIFeatures
    const doc = await features.query; //.explain -> štatistiky

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
