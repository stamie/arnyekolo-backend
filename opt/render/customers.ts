// pricing.engine.ts

export interface Dimension {
  widthMm: number;
  heightMm: number;
}

export interface CalculationInput {
  dimensions: Dimension;
  materialPricePerSqm: number;
  motorBasePrice: number;
  marginPercentage: number;
}

export interface CalculationResult {
  areaSqm: number;
  netMaterialPrice: number;
  netMotorPrice: number;
  netTotalPrice: number;
  grossTotalPrice: number;
}

export class PricingEngine {
  private readonly VAT_RATE = 1.27; // 27% ÁFA

  public calculatePrice(input: CalculationInput): CalculationResult {
    if (input.dimensions.widthMm <= 0 || input.dimensions.heightMm <= 0) {
      throw new Error("A dimenzióknak pozitív számnak kell lenniük.");
    }

    // Terület kiszámítása négyzetméterben
    const areaSqm = (input.dimensions.widthMm / 1000) * (input.dimensions.heightMm / 1000);

    // Alapanyag és motor ára
    const rawMaterialPrice = areaSqm * input.materialPricePerSqm;
    const baseCost = rawMaterialPrice + input.motorBasePrice;

    // Haszonkulcs alkalmazása
    const netTotalPrice = baseCost * (1 + input.marginPercentage / 100);
    const grossTotalPrice = netTotalPrice * this.VAT_RATE;

    return {
      areaSqm: Number(areaSqm.toFixed(2)),
      netMaterialPrice: Number(rawMaterialPrice.toFixed(2)),
      netMotorPrice: Number(input.motorBasePrice.toFixed(2)),
      netTotalPrice: Number(netTotalPrice.toFixed(2)),
      grossTotalPrice: Number(grossTotalPrice.toFixed(2)),
    };
  }
}

// --- DEMO FUTTATÁS / TESZT ---
const engine = new PricingEngine();

const sampleInput: CalculationInput = {
  dimensions: { widthMm: 4000, heightMm: 2500 }, // 4m x 2.5m = 10 m²
  materialPricePerSqm: 15000, // 15.000 Ft / m²
  motorBasePrice: 45000,      // 45.000 Ft Smart motor
  marginPercentage: 20        // 20% árrés
};

try {
  const result = engine.calculatePrice(sampleInput);
  console.log("=== POC ÁRKALKULÁCIÓ EREDMÉNYE ===");
  console.log(`Terület: ${result.areaSqm} m²`);
  console.log(`Nettó anyagár: ${result.netMaterialPrice} Ft`);
  console.log(`Nettó motorár: ${result.netMotorPrice} Ft`);
  console.log(`Nettó összesen: ${result.netTotalPrice} Ft`);
  console.log(`Bruttó összesen (27% ÁFA): ${result.grossTotalPrice} Ft`);
} catch (error) {
  console.error("Hiba a kalkuláció során:", (error as Error).message);
}