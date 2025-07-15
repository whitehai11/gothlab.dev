const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: '*' // Du kannst hier die Domain deiner Seite einschränken, z.B. 'https://gothlab.dev'
}));
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'data.json');
const ADMIN_PASSWORD = 'deinSicheresPasswort';

// Beispiel Early Access Codes (könntest du auch in data.json speichern)
const validCodes = ["ABC123", "VIP2025", "GOTHACCESS"];

// Hilfsfunktion zum Lesen der Daten
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { progress: 0 };
  }
  const json = fs.readFileSync(DATA_FILE);
  return JSON.parse(json);
}

// Hilfsfunktion zum Schreiben der Daten
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET Fortschritt
app.get('/progress', (req, res) => {
  const data = readData();
  res.json({ progress: data.progress || 0 });
});

// POST Fortschritt aktualisieren
app.post('/progress', (req, res) => {
  const { progress, password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    return res.status(400).json({ error: 'Invalid progress value' });
  }
  const data = readData();
  data.progress = progress;
  writeData(data);
  res.json({ success: true, progress });
});

// POST Early-Access Code prüfen
app.post('/check-code', (req, res) => {
  const { code } = req.body;
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' });
  }
  if (validCodes.includes(code.trim())) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
