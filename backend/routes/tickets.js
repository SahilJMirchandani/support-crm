const express = require('express');
const router = express.Router();
const db = require('../database');

// Helper: generate ticket ID like TKT-001
function generateTicketId() {
  const count = db.prepare('SELECT COUNT(*) as count FROM tickets').get().count;
  return `TKT-${String(count + 1).padStart(3, '0')}`;
}

// POST /api/tickets — Create a new ticket
router.post('/', (req, res) => {
  const { customer_name, customer_email, subject, description } = req.body;

  if (!customer_name || !customer_email || !subject || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const ticket_id = generateTicketId();

  const stmt = db.prepare(`
    INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(ticket_id, customer_name, customer_email, subject, description);

  const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(ticket_id);
  res.status(201).json(ticket);
});

// GET /api/tickets — List all tickets (with optional search & filter)
router.get('/', (req, res) => {
  const { status, search } = req.query;

  let query = 'SELECT * FROM tickets WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ` AND (
      customer_name LIKE ? OR
      customer_email LIKE ? OR
      ticket_id LIKE ? OR
      subject LIKE ? OR
      description LIKE ?
    )`;
    const keyword = `%${search}%`;
    params.push(keyword, keyword, keyword, keyword, keyword);
  }

  query += ' ORDER BY created_at DESC';

  const tickets = db.prepare(query).all(...params);
  res.json(tickets);
});

// GET /api/tickets/:ticket_id — Get single ticket with notes
router.get('/:ticket_id', (req, res) => {
  const { ticket_id } = req.params;

  const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(ticket_id);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const notes = db.prepare('SELECT * FROM notes WHERE ticket_id = ? ORDER BY created_at ASC').all(ticket_id);

  res.json({ ...ticket, notes });
});

// PUT /api/tickets/:ticket_id — Update status and/or add a note
router.put('/:ticket_id', (req, res) => {
  const { ticket_id } = req.params;
  const { status, note_text } = req.body;

  const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(ticket_id);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  if (status) {
    db.prepare(`
      UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ?
    `).run(status, ticket_id);
  }

  if (note_text) {
    db.prepare(`
      INSERT INTO notes (ticket_id, note_text) VALUES (?, ?)
    `).run(ticket_id, note_text);
  }

  res.json({ success: true, updated_at: new Date().toISOString() });
});

module.exports = router;