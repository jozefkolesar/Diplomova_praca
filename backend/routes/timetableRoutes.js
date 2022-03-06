const express = require('express');
const authController = require('../controllers/authController');
const timetableController = require('../controllers/timetableController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'student')); //všetky cesty pod ním sú restricted na admina + student

router.get('/get-courses', timetableController.getStudentCourses);
router.get('/get-all-courses', timetableController.getAllCourses);
router.post('/create-course', timetableController.createCourse);

module.exports = router;
