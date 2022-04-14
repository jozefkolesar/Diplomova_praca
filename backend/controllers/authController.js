const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const sendEmail = require('../utilities/email');

const signToken = (id) =>
  jwt.sign({ id }, `${process.env.JTW_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + `${process.env.JWT_COOKIE_EXPIRES_IN}` * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //Cookie nemôže byť modifikovaný browserom
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  //odstranim heslo z outputu
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const newUser = await User.create({
      //Rozpisane kvoli bezpečnosti - pri starom kode sa mohol hocikto zaregistrovať ako admin
      name: req.body.name,
      faculty: req.body.faculty,
      year: req.body.year,
      department: req.body.department,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    //Ak rovnaký email pri registrácii už existuje tak chyba
    createSendToken(newUser, 201, res);
  } else {
    return next(
      new AppError(`Účet s mailovou adresou : ${email} už existuje!`, 401)
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Zistíme či existuje email a heslo
  if (!email || !password) {
    return next(new AppError('Uveďte meno a heslo!', 400));
  }
  //Existuje používateľ a zároveň heslo je správne
  const user = await User.findOne({ email }).select('+password'); // +password lebo default heslo select: false

  if (!user || !(await user.correctPassword(password, user.password))) {
    //ak neexistuje správny user a jeho správne heslo tak 401 - Not authorized
    return next(new AppError('Nesprávne zadaný email alebo heslo'), 401);
  }

  //Ak všetko správne, poslať token klientovi spolu s jeho parametrami
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //Získanie tokenu a check či existuje
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('Nie si prihlásený -> nemáš prístup!', 401)); //not authorized = 401
  }
  //validácia/verifikácia tokenu
  const decoded = await promisify(jwt.verify)(
    token,
    `${process.env.JTW_SECRET}`
  ); //promisify na to aby sme z toho mohli urobiť async funkciu

  //Check či user existuje
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('Používateľ, ktorému patril token už neexistuje!', 401)
    );
  }

  //Check či user zmenil heslo po tom ako TOKEN was issued - či medzičasom nebol user vymazaný -> updatnutý
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Používateľské heslo bolo nedávno zmenené! Prosím prihláste sa znovu.',
        401
      )
    );
  } //decoded.issuedat
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //Verifikácia tokenu
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        `${process.env.JTW_SECRET}`
      );

      //Check či user existuje
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //Check či user zmenil heslo po tom ako TOKEN was issued - či medzičasom nebol user vymazaný -> updatnutý
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //ak je používateľ prihlásený, ulož ho do locals
      res.locals.user = currentUser; //uloženie info o prihlásenom používateľovi
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(); //403 = forbidden
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //zachytitť usera v maily
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('Používateľ s touto emailovou adresou neexistuje!', 401)
    );
  }
  // vygenerovanie random reset tokenu
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //dôležité, validateBeforeSave: false, nemám všetky parametre pre správnu validáciu

  //poslanie mailu
  const resetURL = `${req.protocol}://diplomovka-dbec5.web.app/api/users/resetPassword/${resetToken}`;

  const message = `Zabudli ste svoje heslo?\n\nPre vytvorenie nového hesla kliknite na nasledujúci odkaz:\n\n ${resetURL}\n\nAk ste o zmenu hesla nepožiadali, ignorujte prosím tento email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Váš token na reset hesla (funkčný len po dobu 10 minút!)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token odoslaný na mail! (prosím skontrolujte zložku SPAM)',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Vyskytol sa problém pri odosielaní emailu!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Získanie usera pomocou tokenu
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token) //req.params.token preto lebo url => '/resetPassword/:token'
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, //chceck či token nevypršal
  });
  //Ak token nie je neplatný a existuje user, setni password
  if (!user) {
    return next(new AppError('Token je neplatný!', 500));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  if (user.password !== user.passwordConfirm) {
    return next(new AppError('Novo-zadané heslá sa nezhodujú!', 401));
  }
  await user.save({ validateBeforeSave: false });

  //Prihlás uživateľa, pošli JWT (token)
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Vybrať usera z kolekcie
  const user = await User.findById(req.user.id).select('+password');
  //Kontrola, či zadal správne aktuálne heslo
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Vaše aktuálne zadané heslo je nesprávne!', 401));
  }
  //Ak zadal správne heslo, tak update hesla
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  if (user.password !== user.passwordConfirm) {
    return next(new AppError('Novo-zadané heslá sa nezhodujú!', 401));
  }
  await user.save({ validateBeforeSave: false });

  //Prihlás usera a pošli JWT
  createSendToken(user, 200, res);
});
