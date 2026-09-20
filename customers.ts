import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Teszt végpont
app.get('/', (req, res) => {
  res.send('Árkalkuláció backend működik!');
});

// Kalkuláció API végpont
app.get('/kalkulacio', (req, res) => {
  const terulet = 10;
  const nettoAnyagar = 150000;
  const nettoMotorar = 45000;
  const nettoÖsszesen = 234000;
  const bruttoÖsszesen = 297180;

  res.json({
    terulet,
    nettoAnyagar,
    nettoMotorar,
    nettoÖsszesen,
    bruttoÖsszesen
  });
});

// A szerver elindítása (FONTOS: process.env.PORT kell a Render-nek!)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});