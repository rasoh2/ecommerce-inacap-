import mongoose from 'mongoose';

const connectDB = () => {
  const connectWithRetry = () => {
    console.log('Intentando conectar a MongoDB...');
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`MongoDB Conectado: ${conn.connection.host}`);
    })
    .catch((error) => {
      console.error(`Error de conexión a MongoDB: ${error.message}. Reintentando en 5 segundos... (Asistido por IA)`);
      setTimeout(connectWithRetry, 5000);
    });
  };

  connectWithRetry();
};

export default connectDB;
