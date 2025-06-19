require("dotenv").config();
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());


// Middleware para verificar chave da API
app.use((req, res, next) => {
  const userKey = req.query.key || req.headers["x-api-key"];
  if (userKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Chave de API inválida ou ausente" });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("🔐 API do TVGO está protegida por chave.");
});

app.get("/novelas", (req, res) => {
  try {
    const data = fs.readFileSync("novelas_completo.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Erro ao ler arquivo de novelas." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});