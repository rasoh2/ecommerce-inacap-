const errorHandler = (err, req, res, next) => {
  console.error('Error no controlado en el servidor:', err.stack || err.message);

  // Evitamos revelar detalles técnicos sensibles en producción
  const message = process.env.NODE_ENV === 'production' 
    ? 'Ocurrió un error interno en el servidor.' 
    : err.message;

  res.status(err.status || 500).json({
    message,
    status: err.status || 500
  });
};

export default errorHandler;
