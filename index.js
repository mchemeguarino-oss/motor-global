import express from "express";
import cors from "cors";
import { chromium } from "playwright-core";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SCRAPE MERCADO LIVRE REAL
========================= */
app.post("/scrape-product", async (req, res) => {
  const { url } = req.body;

  let browser;

  try {
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    // espera elementos carregarem
    await page.waitForTimeout(3000);

    // 🔥 EXTRAÇÃO REAL
    const data = await page.evaluate(() => {
      const title =
        document.querySelector("h1")?.innerText ||
        "Produto não encontrado";

      const priceText =
        document.querySelector(".andes-money-amount__fraction")?.innerText ||
        "0";

      const image =
        document.querySelector("img")?.src || "";

      return {
        title,
        price: parseFloat(priceText.replace(/\./g, "").replace(",", ".")) || 0,
        image
      };
    });

    await browser.close();

    res.json(data);

  } catch (error) {
    if (browser) await browser.close();

    console.error(error);
    res.status(500).json({
      error: "Erro ao fazer scraping com Playwright"
    });
  }
});

/* =========================
   FORNECEDORES (AINDA MOCK)
========================= */
app.post("/analyze-product", async (req, res) => {
  const { title } = req.body;

  const searchQuery = encodeURIComponent(title);

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
});

/* ========================= */

app.get("/", (req, res) => {
  res.send("API rodando com Playwright 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
