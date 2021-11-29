const userRoutes = require('./user');
const itemRoutes = require('./item');

const constructorMethod = (app) => {

  app.use('/user', userRoutes);
  app.use('/item', itemRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
  });
};

module.exports = constructorMethod;