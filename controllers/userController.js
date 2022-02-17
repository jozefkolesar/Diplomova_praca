const User = require('../models/userModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  }); //loopovanie cez objekt v Javasctipte
  return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; //req.params.id využíva getOne, tak jej podsuniem id usera, ktorý je aktuálne prihlásený
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Vytvoriť error ak user pošle údaje o zmene hesla
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Táto funkcia je určená na zmenu mena a mailu, nie hesiel!',
        400
      )
    );
  }
  // 2) Filtrovanie objektu, aby som mal fieldy len tie ktoré potrebujem pre updateUser
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) update user - ktorý je prihlásený
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }); //new true musí byť kvôli tomu aby som nahral starý objekt novým, nemôžem robiť s body lebo by si to mohol user meniť, napr body.role a zmenil by rolu

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

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); // s týmto sa neupdatuje heslo, len meno a email
exports.deleteUser = factory.deleteOne(User);
