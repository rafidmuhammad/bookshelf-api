const {
	addBooksHandler,
	listAllBooksHandler,
	getBookById,
	deleteBookByID,
	updateBookByID,
} = require('./handler');

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBooksHandler,
	},
	{
		method: 'GET',
		path: '/books',
		handler: listAllBooksHandler,
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: getBookById,
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: deleteBookByID,
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: updateBookByID,
	},
];
module.exports = routes;
