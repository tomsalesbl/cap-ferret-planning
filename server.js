const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DB_FILE = path.join(__dirname, 'data.json');

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
    catch { return []; }
    }

    function writeDB(data) {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      }

      app.use(express.json());
      app.use(express.static(path.join(__dirname, 'public')));

      app.get('/api/bookings', (req, res) => {
        const { from, to } = req.query;
          res.json(readDB().filter(b => b.date >= from && b.date <= to));
          });

          app.put('/api/bookings', (req, res) => {
            const { couple, date, status, note } = req.body;
              if (!couple || !date || !status) return res.status(400).json({ error: 'missing' });
                const db = readDB();
                  const idx = db.findIndex(b => b.couple === couple && b.date === date);
                    const entry = { couple, date, status, note: note || '', updated_at: new Date().toISOString() };
                      if (idx >= 0) db[idx] = entry; else db.push(entry);
                        writeDB(db);
                          res.json({ ok: true });
                          });

                          app.delete('/api/bookings', (req, res) => {
                            const { couple, date } = req.body;
                              if (!couple || !date) return res.status(400).json({ error: 'missing' });
                                writeDB(readDB().filter(b => !(b.couple === couple && b.date === date)));
                                  res.json({ ok: true });
                                  });

                                  const PORT = process.env.PORT || 3000;
                                  app.listen(PORT, () => console.log('Cap Ferret Planning on port ' + PORT));
