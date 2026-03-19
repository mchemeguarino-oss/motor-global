import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   🔍 SCRAPE DO MERCADO LIVRE
================================ */

app.post("/scrape-product", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();

    // 🔍 EXTRAÇÃO SIMPLES
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const priceMatch = html.match(/"price":\s?(\d+\.?\d*)/);
    const imageMatch = html.match(/"secure_thumbnail":"(.*?)"/);

    const title = titleMatch
      ? titleMatch[1].replace(" | Mercado Livre", "")
      : "Produto não encontrado";

    const price = priceMatch
      ? parseFloat(priceMatch[1])
      : 0;

    const image = imageMatch
      ? imageMatch[1].replace(/\\u0026/g, "&")
      : "";

    res.json({
      title,
      price,
      image
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao extrair dados do produto"
    });
  }
});

/* ================================
   🌍 ANALISE DE FORNECEDORES
================================ */

app.post("/analyze-product", async (req, res) => {
  const { title } = req.body;

  try {
    const searchQuery = encodeURIComponent(title);

    // 🔥 preços dinâmicos
    const basePrice = Math.random() * (20 - 5) + 5;

    const suppliers = [
      {
        platform: "AliExpress",
        price: parseFloat((basePrice + 2).toFixed(2)),
        shipping: 5,
        rating: 4.7,
        orders: Math.floor(Math.random() * 2000),
        link: `https://www.aliexpress.com/wholesale?SearchText=${searchQuery}`
      },
      {
        platform: "Alibaba",
        price: parseFloat((basePrice).toFixed(2)),
        shipping: 7,
        rating: 4.6,
        orders: Math.floor(Math.random() * 1500),
        link: `https://www.alibaba.com/trade/search?SearchText=${searchQuery}`
      },
      {
        platform: "Temu",
        price: parseFloat((basePrice - 1).toFixed(2)),
        shipping: 6,
        rating: 4.5,
        orders: Math.floor(Math.random() * 1000),
        link: `https://www.temu.com/search_result.html?search_key=${searchQuery}`
      }
    ];

    res.json({ suppliers });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao buscar fornecedores"
    });
  }
});

/* ================================
   🚀 ROOT
================================ */

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

/* ================================
   🚀 SERVER
================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
