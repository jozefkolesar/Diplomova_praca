const express = require('express');
const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'student')); //všetky cesty pod ním sú restricted na admina + student

router.get('/new-reports', reportController.getNewReports);
router.get('/report-stats', reportController.getReportStats);
router.get('/all-teacher-reports', reportController.getAllTeacherReports);
router.get('/all-student-reports', reportController.getAllStudentReports);
router.get('/pending-reports', reportController.getPendingReports);

router
  .route('/')
  .get(reportController.getAllReports)
  .post(
    reportController.uploadReportPhoto,
    reportController.resizeReportPhoto,
    reportController.createReport
  );
router
  .route('/:id')
  .get(reportController.getReport)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

module.exports = router;
