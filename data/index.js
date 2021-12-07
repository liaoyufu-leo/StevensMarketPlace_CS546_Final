const userData = require('./user');
const itemData = require('./item');
const commentData = require('./comment');
const transactionData = require('./transaction');
const chatData = require('./chat');

module.exports = {
    user: userData,
    item: itemData,
    comment: commentData,
    transaction: transactionData,
    chat: chatData
};
