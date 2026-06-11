const db = require('../config/db');

// --- Dashboard ---
exports.getDashboardStats = async (req, res) => {
  try {
    const [[shedsCount]] = await db.query('SELECT COUNT(*) as count FROM sheds');
    const [[linesCount]] = await db.query('SELECT COUNT(*) as count FROM `lines`');
    const [[machinesCount]] = await db.query('SELECT COUNT(*) as count FROM machines');
    const [[logsCount]] = await db.query('SELECT COUNT(*) as count FROM logs');
    
    const [recentLogs] = await db.query(`
      SELECT l.*, m.machine_name, m.machine_code 
      FROM logs l
      JOIN machines m ON l.machine_id = m.id
      ORDER BY l.created_at DESC
      LIMIT 10
    `);

    res.json({
      stats: {
        totalSheds: shedsCount.count,
        totalLines: linesCount.count,
        totalMachines: machinesCount.count,
        totalLogs: logsCount.count
      },
      recentLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching dashboard stats' });
  }
};

// --- Sheds ---
exports.getSheds = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sheds ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createShed = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO sheds (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteShed = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM sheds WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// --- Lines ---
exports.getLinesByShed = async (req, res) => {
  const { shedId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM `lines` WHERE shed_id = ? ORDER BY created_at DESC', [shedId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createLine = async (req, res) => {
  const { shedId } = req.params;
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO `lines` (name, shed_id) VALUES (?, ?)', [name, shedId]);
    res.status(201).json({ id: result.insertId, name, shed_id: shedId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteLine = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM `lines` WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// --- Machines ---
exports.getMachinesByLine = async (req, res) => {
  const { lineId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM machines WHERE line_id = ? ORDER BY created_at DESC', [lineId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMachineDetails = async (req, res) => {
  const { machineId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT m.*, l.name as line_name, s.name as shed_name
      FROM machines m
      JOIN \`lines\` l ON m.line_id = l.id
      JOIN sheds s ON l.shed_id = s.id
      WHERE m.id = ?
    `, [machineId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Machine not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createMachine = async (req, res) => {
  const { lineId } = req.params;
  const { machine_code, machine_name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO machines (machine_code, machine_name, line_id) VALUES (?, ?, ?)', [machine_code, machine_name, lineId]);
    res.status(201).json({ id: result.insertId, machine_code, machine_name, line_id: lineId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMachine = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM machines WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// --- Logs ---
exports.getLogsByMachine = async (req, res) => {
  const { machineId } = req.params;
  const { status, operator, startDate, endDate } = req.query;
  try {
    let query = 'SELECT * FROM logs WHERE machine_id = ?';
    let params = [machineId];

    if (status) {
      query += ' AND machine_status = ?';
      params.push(status);
    }
    if (operator) {
      query += ' AND employee_name LIKE ?';
      params.push(`%${operator}%`);
    }
    if (startDate && endDate) {
      query += ' AND DATE(created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createLog = async (req, res) => {
  const { machineId } = req.params;
  const { employee_name, employee_code, type_of_work, part_used, time_taken, activity, remarks, machine_status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO logs (machine_id, employee_name, employee_code, type_of_work, part_used, time_taken, activity, remarks, machine_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [machineId, employee_name, employee_code, type_of_work || 'General', part_used, time_taken || null, activity, remarks, machine_status]
    );
    const [newLog] = await db.query('SELECT * FROM logs WHERE id = ?', [result.insertId]);
    res.status(201).json(newLog[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
