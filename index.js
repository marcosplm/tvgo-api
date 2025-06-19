
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());

app.get("/", (req, res) => {
  res.send("API do TVGO está no ar!");
});

app.get("/novelas", (req, res) => {
  try {
    const data = fs.readFileSync("./programas.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler o arquivo programas.json" });
  }
});

app.get("/atualizar", async (req, res) => {
  const clientKey = req.query.key || req.headers["x-api-key"];
  if (clientKey !== API_KEY) {
    return res.status(403).json({ error: "Chave de API inválida ou ausente" });
  }

  const url = "https://tvgo.americatv.com.pe/novelas";
  const programas = [];

  try {
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const links = await page.$$eval('a.relative', (elements) => {
      return elements.map((el) => {
        const href = el.href;
        const slug = href.split("/").filter(Boolean).pop().split("?")[0];
        return {
          slug,
          link: href,
          image: el.querySelector("img")?.src || null,
        };
      });
    });

    for (const item of links) {
      try {
        const pg = await browser.newPage();
        await pg.goto(item.link, { waitUntil: "domcontentloaded" });
        const content = await pg.content();
        const bloco = content.split("<!--Array")[1]?.split("-->")[0];
        if (!bloco) throw new Error("Bloco não encontrado");

        const get = (label) => {
          const match = bloco.match(new RegExp(`\[${label}\] => (.*?)\n`));
          return match ? match[1].trim() : null;
        };

        const imageMatch = bloco.match(/\[url\] => (https?:\/\/.*?imageSize=1920x795)/);
        const imageFull = imageMatch ? imageMatch[1].replace(/\/g, "") : item.image;

        programas.push({
          title: get("title"),
          slug: item.slug,
          category: get("categoryTitle"),
          seasonCount: get("seasonCount"),
          description: get("description"),
          image: imageFull,
          link: item.link,
        });
        await pg.close();
      } catch (err) {
        console.error(`Erro ao processar ${item.link}: ${err.message}`);
      }
    }

    await browser.close();
    fs.writeFileSync("programas.json", JSON.stringify(programas, null, 2));
    res.json({ message: "Dados atualizados com sucesso", count: programas.length });
  } catch (err) {
    console.error("Erro geral:", err);
    res.status(500).json({ error: "Erro ao atualizar os dados" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
