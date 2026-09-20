import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Teszt végpont
app.get('/', (req, res) => {
  res.send('Árkalkuláció backend működik!');
});

// Backend API végpont
app.get('/calc', (req, res) => {
  if (!req.query.width || !req.query.height || !req.query.materialPrice || !req.query.motorPrice || !req.query.color) {
    return res.status(400).json({ error: 'Hiányzó paraméterek. Kérlek add meg a szélességet, magasságot, anyagtípusát, motor paraméterét és anyag színét.' });
  }
  const width = parseFloat(req.query.width);
  const height = parseFloat(req.query.height);
  const color = req.query.color;
  const motorPrice = parseFloat(req.query.motorPrice);

// --- 1. ÁRKALUKÁCIÓS LOGIKA (TypeScript/JS) ---
  const VAT_RATE = 1.27; // 27% ÁFA
  const MATERIAL_PRICE_PER_SQM = 15000; // 15.000 Ft / m2
  const MARGIN_PERCENTAGE = 20; // 20% árrés


  if (width <= 0 || height <= 0) {
    return res.status(400).json({ error: "A dimenzióknak pozitív számnak kell lenniük." });
  }

  const areaSqm = (width / 1000) * (height / 1000);
  const rawMaterialPrice = areaSqm * MATERIAL_PRICE_PER_SQM;
  const baseCost = rawMaterialPrice + motorPrice;
  const netTotalPrice = baseCost * (1 + MARGIN_PERCENTAGE / 100);
  const grossTotalPrice = netTotalPrice * VAT_RATE;

  return res.json({
    areaSqm: areaSqm.toFixed(2),
    netTotalPrice: Math.round(netTotalPrice),
    grossTotalPrice: Math.round(grossTotalPrice)
  });

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