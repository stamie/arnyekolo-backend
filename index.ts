import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Teszt végpont
app.get('/', (req, res) => {
  res.send('Árkalkuláció backend működik!');
});

// Backend API végpont
app.get('/backend', (req, res) => {
  if (!req.query.user || !req.query.password) {
    return res.status(400).json({ error: 'Hiányzó paraméterek. Kérlek add meg a user és password paramétereket.' });
  }
});

app.get('/backend', (req, res) => {
  if (!req.query.user || !req.query.password) {
    return res.status(400).json({ error: 'Hiányzó paraméterek. Kérlek add meg a user és password paramétereket.' });
  }
});
// A szerver elin1dítása (FONTOS: process.env.PORT kell a  Render-nek!)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});