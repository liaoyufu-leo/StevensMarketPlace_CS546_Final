const userRoutes = require('./user');

const constructorMethod = (app) => {

  app.use('/user', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
  });
};

module.exports = constructorMethod;

// hey, we need add the routes
