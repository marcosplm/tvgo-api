const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API do TVGO está no ar!");
});

app.get("/novelas", (req, res) => {
  try {
    const data = fs.readFileSync("programas.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
