import express from 'express';
import cors from 'cors';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://estampel_db_user:AxoQHPVCm3SFIwSD@arnyekolo.kwdrczy.mongodb.net";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const Db = client.db("orders");

async function sendCalculation(jsonInsertData: json) {
  var response_ = { error: "Error occurred while inserting document:", result: '-1' };
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const collection = Db.collection("orders");
    const res = await collection.insertOne(jsonInsertData);
    response_ = { 
      result: res.insertedId,
      message: "Document inserted successfully."
    };
    
  } catch (error) {
    
  
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    return response_;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Teszt végpont
app.get('/', (req, res) => {
  res.send('Árkalkuláció backend működik!');
});

// Backend API végpont
app.post('/calc', async (req, res) => {
  const { width, height, motorPrice, color } = req.body;
  if (!width || !height || !motorPrice || !color) {
    return res.status(400).json({ error: 'Hiányzó paraméterek. Kérlek add meg a szélességet, magasságot, anyagtípusát, motor paraméterét és anyag színét.' });
  }

// --- 1. ÁRKALUKÁCIÓS LOGIKA (TypeScript/JS) ---
  const VAT_RATE = 1.27; // 27% ÁFA
  const MATERIAL_PRICE_PER_SQM = 15000; // 15.000 Ft / m2
  const MARGIN_PERCENTAGE = 20; // 20% árrés


  if (width <= 0 || height <= 0) {
    return res.status(400).json({ error: "A dimenzióknak pozitív számnak kell lenniük." });
  }

  const areaSqm = (parseFloat(width) / 1000) * (parseFloat(height) / 1000);
  const rawMaterialPrice = areaSqm * MATERIAL_PRICE_PER_SQM;
  const baseCost = rawMaterialPrice + parseFloat(motorPrice);
  const netTotalPrice = baseCost * (1 + MARGIN_PERCENTAGE / 100);
  const grossTotalPrice = netTotalPrice * VAT_RATE;
  try {
    const insertData = {
      areaSqm: areaSqm.toFixed(2),
      netTotalPrice: Math.round(netTotalPrice),
      grossTotalPrice: Math.round(grossTotalPrice),
      width: parseFloat(width),
      height: parseFloat(height),
      motorPrice: parseFloat(motorPrice),
      color: color,
      timestamp: new Date().toISOString()
    };
    const response_ = await sendCalculation(insertData);
    return res.status(200).json(response_);

  } catch (error) {
    return res.status(400).json({ error: " Error occurred while inserting document: " + error });
  }
  
});

app.post('/backend', (req, res) => {
  if (!req.body.user || !req.body.password) {
    return res.status(400).json({ error: 'Hiányzó paraméterek. Kérlek add meg a user és password paramétereket.' });
  }
  const user = req.body.user;
  const password = req.body.password;

  // Itt végezheted el a backend logikát, például ellenőrizheted a felhasználót és jelszót.
  // Például:
  if (user === 'admin' && password === 'password123') {
    // Hívjuk meg az adatbázisba történő mentést
   return res.json({ message: 'Sikeres bejelentkezés!' });
  } else {
    return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó.' });
  }
  
});
// A szerver elin1dítása (FONTOS: process.env.PORT kell a  Render-nek!)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});