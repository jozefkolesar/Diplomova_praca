const express = require('express');

const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'student')); //všetky cesty pod ním sú restricted na admina

router.get('/new-reports', reportController.getNewReports);
router.route('/report-stats').get(reportController.getReportStats);

router
  .route('/')
  .get(reportController.getAllReports)
  .post(reportController.createReport);
router
  .route('/:id')
  .get(reportController.getReport)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

module.exports = router;
