
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/novelas', (req, res) => {
  try {
    const data = fs.readFileSync('novelas_completo.json', 'utf-8');
    const json = JSON.parse(data);
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar os dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
