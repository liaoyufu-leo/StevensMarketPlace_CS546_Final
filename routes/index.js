const userRoutes = require('./user');
const itemRoutes = require('./item');
const commentRoutes = require('./comment');
const myprofileRoutes = require('./myprofile');
const chatRoutes = require('./chat');
const transactionRoutes = require('./transaction');

const constructorMethod = (app) => {

  app.use('/user', userRoutes);
  app.use('/item', itemRoutes);
  app.use('/comment', commentRoutes);
  app.use('/myprofile', myprofileRoutes);
  app.use('/chat', chatRoutes);
  app.use('/transaction', transactionRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
  });
};

module.exports = constructorMethod;