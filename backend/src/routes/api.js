const express = require('express');
const router = express.Router();
const logbookController = require('../controllers/logbookController');

// Dashboard
router.get('/dashboard', logbookController.getDashboardStats);

// Sheds
router.get('/sheds', logbookController.getSheds);
router.post('/sheds', logbookController.createShed);
router.delete('/sheds/:id', logbookController.deleteShed);

// Lines
router.get('/sheds/:shedId/lines', logbookController.getLinesByShed);
router.post('/sheds/:shedId/lines', logbookController.createLine);
router.delete('/lines/:id', logbookController.deleteLine);

// Machines
router.get('/lines/:lineId/machines', logbookController.getMachinesByLine);
router.get('/machines/:machineId', logbookController.getMachineDetails);
router.post('/lines/:lineId/machines', logbookController.createMachine);
router.delete('/machines/:id', logbookController.deleteMachine);

// Logs
router.get('/machines/:machineId/logs', logbookController.getLogsByMachine);
router.post('/machines/:machineId/logs', logbookController.createLog);

module.exports = router;
