const userData = require('./user');
const itemData = require('./item');
const commentData = require('./comment');
const transactionData = require('./transaction');

module.exports = {
    user: userData,
    item: itemData,
    comment: commentData,
    transaction: transactionData
};
