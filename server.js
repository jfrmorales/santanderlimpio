const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Proxy to Santander Open Data API (avoids CORS)
app.get('/api/contenedores', (req, res) => {
  const page = req.query.page || 1;
  const items = req.query.items || 200;
  const url = `http://datos.santander.es/api/rest/datasets/residuos_contenedores.json?items=${items}&page=${page}`;

  http.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
      } catch (e) {
        res.status(500).json({ error: 'Error parsing API response' });
      }
    });
  }).on('error', (e) => {
    res.status(502).json({ error: 'Error connecting to Santander API' });
  });
});

app.get('/api/papeleras', (req, res) => {
  const page = req.query.page || 1;
  const items = req.query.items || 200;
  const url = `http://datos.santander.es/api/rest/datasets/residuos_papeleras.json?items=${items}&page=${page}`;

  http.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
      } catch (e) {
        res.status(500).json({ error: 'Error parsing API response' });
      }
    });
  }).on('error', (e) => {
    res.status(502).json({ error: 'Error connecting to Santander API' });
  });
});

app.get('/api/vehiculos', (req, res) => {
  const url = `http://datos.santander.es/api/rest/datasets/residuos_vehiculos.json?items=200`;

  http.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
      } catch (e) {
        res.status(500).json({ error: 'Error parsing API response' });
      }
    });
  }).on('error', (e) => {
    res.status(502).json({ error: 'Error connecting to Santander API' });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Santander Basuras running on port ${PORT}`);
});
