const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send("✅ API TVGO está rodando!");
});

app.get('/novelas', (req, res) => {
  try {
    const data = fs.readFileSync('novelas_completo.json', 'utf-8') || '[]';
    const json = JSON.parse(data);
    res.json(json);
  } catch (err) {
    console.error("❌ Erro ao ler o JSON:", err.message);
    res.status(500).json({ error: 'Erro ao carregar os dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
