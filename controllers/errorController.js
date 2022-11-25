const sendErrorDev = (err, req, res) => {
       res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    }
  

  
  const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
      // A) Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      // B) Programming or other unknown error: don't leak error details
      // 1) Log error
      console.error('ERROR 💥', err);
      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  
    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.'
    });
  };

module.exports =(err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
      } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, req, res);

      }
}