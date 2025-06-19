const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});