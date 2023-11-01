const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3050;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'formulario_rrhh',
  password: 'agustin123',
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    next();
  });
  
// Endpoint para obtener todas las preguntas
app.get('/preguntas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM preguntas');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las preguntas');
  }
});

// Endpoint para crear un nuevo comentario
app.post('/comentarios', async (req, res) => {
  try {
    const { respuesta, comentario } = req.body;
    const result = await pool.query('INSERT INTO comentarios (respuesta, comentario) VALUES ($1, $2) RETURNING *', [respuesta, comentario]);
    res.send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el comentario');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

//docker compose 5.0.33.191/ y que puedan usar sin ser root