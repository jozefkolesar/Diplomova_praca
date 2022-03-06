const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const facultyController = require('../controllers/facultyController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/get-faculties', facultyController.getAllFaculties);

router.use(authController.protect); //všetky cesty pod ním sú chránené - netreba všade hádzať  authController.protect

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser); //poskytne info o práve prihlásenom používateľovi.

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin')); //všetky cesty pod ním sú restricted na admina

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
