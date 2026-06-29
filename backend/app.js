import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB();

const app = express();

// Middlewares globales
const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como curl o postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());

// Middleware de sanitización contra inyección NoSQL inmutable (Tarea B2)
app.use((req, res, next) => {
  const deepCloneAndSanitize = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    // Clonación profunda
    let cloned;
    try {
      cloned = structuredClone(obj);
    } catch (e) {
      cloned = JSON.parse(JSON.stringify(obj));
    }

    const sanitize = (val) => {
      if (val === null || typeof val !== 'object') {
        return val;
      }
      if (Array.isArray(val)) {
        return val.map(sanitize);
      }
      const cleanObj = {};
      Object.keys(val).forEach(key => {
        if (!/^\$/.test(key)) {
          cleanObj[key] = sanitize(val[key]);
        }
      });
      return cleanObj;
    };

    return sanitize(cloned);
  };

  if (req.body) req.body = deepCloneAndSanitize(req.body);
  if (req.query) req.query = deepCloneAndSanitize(req.query);
  if (req.params) req.params = deepCloneAndSanitize(req.params);
  next();
});

// Obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend desde la raíz
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Servir el index.html en cualquier ruta que no sea de la API (para SPA/Soporte rutas estáticas)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware de manejo de errores global
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Servidor de e-commerce corriendo en http://localhost:${PORT}`);
  console.log(`Entorno del servidor: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${PORT} ya está siendo utilizado por otro proceso.`);
    process.exit(1);
  } else {
    console.error('Error no controlado en el servidor HTTP:', error);
    process.exit(1);
  }
});
