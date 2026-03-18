import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze-product", async (req, res) => {
  const { title } = req.body;

  // MOCK TEMPORÁRIO
  const suppliers = [
    {
      platform: "AliExpress",
      price: 10,
      shipping: 5,
      rating: 4.8,
      orders: 1200,
      link: "https://example.com"
    },
    {
      platform: "Alibaba",
      price: 9,
      shipping: 7,
      rating: 4.7,
      orders: 800,
      link: "https://example.com"
    },
    {
      platform: "Temu",
      price: 8,
      shipping: 6,
      rating: 4.6,
      orders: 500,
      link: "https://example.com"
    }
  ];

  res.json({ suppliers });
});

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});