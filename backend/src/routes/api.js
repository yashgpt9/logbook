const express = require('express');
const router = express.Router();
const logbookController = require('../controllers/logbookController');
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Auth
router.post('/auth/login', authController.login);

// Dashboard
router.get('/dashboard', verifyToken, logbookController.getDashboardStats);

// Sheds
router.get('/sheds', verifyToken, logbookController.getSheds);
router.post('/sheds', [verifyToken, requireAdmin], logbookController.createShed);
router.delete('/sheds/:id', [verifyToken, requireAdmin], logbookController.deleteShed);

// Lines
router.get('/sheds/:shedId/lines', verifyToken, logbookController.getLinesByShed);
router.post('/sheds/:shedId/lines', [verifyToken, requireAdmin], logbookController.createLine);
router.delete('/lines/:id', [verifyToken, requireAdmin], logbookController.deleteLine);

// Machines
router.get('/lines/:lineId/machines', verifyToken, logbookController.getMachinesByLine);
router.get('/machines/:machineId', verifyToken, logbookController.getMachineDetails);
router.post('/lines/:lineId/machines', [verifyToken, requireAdmin], logbookController.createMachine);
router.delete('/machines/:id', [verifyToken, requireAdmin], logbookController.deleteMachine);

// Logs
router.get('/machines/:machineId/logs', verifyToken, logbookController.getLogsByMachine);
router.post('/machines/:machineId/logs', verifyToken, logbookController.createLog);

module.exports = router;
