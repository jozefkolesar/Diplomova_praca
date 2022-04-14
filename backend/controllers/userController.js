const cron = require('node-cron');
const User = require('../models/userModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const yearChange = async () => {
  //automaticka zmena roku dochadzky studentov (1-5)
  await User.deleteMany({ year: 5 });
  await User.updateMany({ role: 'student' }, { $inc: { year: 1 } });
};

cron.schedule('0 22 10 9 *', () => {
  //10 septembra každý rok sa prida +1 ku roku studia studenta / ak 5. rok tak zmazať študenta
  yearChange();
});

// Výpis všetkých používateľov - development
exports.getAllUsers = factory.getAll(User);

// Výpis aktuálneho používateľa
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//Možnosť zmeny mena/emailu
exports.updateMe = catchAsync(async (req, res, next) => {
  //Vytvoriť error ak user pošle údaje o zmene hesla
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Táto funkcia je určená na zmenu mena a mailu, nie hesiel!',
        400
      )
    );
  }
  //Filtrovanie objektu, aby vstup boli fieldy tie ktoré potrebujem pre updateUser
  const filteredBody = filterObj(req.body, 'name', 'email');

  //Update user - ktorý je prihlásený
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }); //new true musí byť kvôli tomu aby som nahral starý objekt novým

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

//delete používateľa - od používateľa samého
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Výpis používateľa podľa jeho ID
exports.getUser = factory.getOne(User, 'reports');

//Update používateľa podľa jeho ID
exports.updateUser = factory.updateOne(User);

//Vymazanie používateľa podľa jeho ID
exports.deleteUser = factory.deleteOne(User);
