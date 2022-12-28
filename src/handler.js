const books = require('./books');
const {nanoid} = require('nanoid');

const addBooksHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	// NOTE : no name
	if (name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}

	// NOTE : readPage lebih besar dari jumlah halaman
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	books.push(newBook);

	const isSuccess = books.filter(book => book.id === id).length > 0;
	// NOTE : successfully
	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	}

	//
	const response = h.response({
		status: 'error',
		message: 'Buku gagal ditambahkan',
	});
	response.code(500);
	return response;
};

const listAllBooksHandler = (request, h) => {
	let booksList = [];
	const {name, reading, finished} = request.query;

	if (name !== undefined) {
		booksList = books
			.filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
			.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			}));
		const response = h.response({
			status: 'success',
			data: {books: booksList},
		});
		return response;
	}

	if (reading === '1') {
		booksList = books
			.filter(book => book.reading === true)
			.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			}));
		const response = h.response({
			status: 'success',
			data: {books: booksList},
		});
		return response;
	}

	if (reading === '0') {
		booksList = books
			.filter(book => book.reading === false)
			.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			}));
		const response = h.response({
			status: 'success',
			data: {books: booksList},
		});
		return response;
	}

	if (finished === '1') {
		booksList = books
			.filter(book => book.finished === true)
			.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			}));
		const response = h.response({
			status: 'success',
			data: {books: booksList},
		});
		return response;
	}

	if (finished === '0') {
		booksList = books
			.filter(book => book.finished === false)
			.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			}));
		const response = h.response({
			status: 'success',
			data: {books: booksList},
		});
		return response;
	}

	booksList = books.map(book => ({
		id: book.id,
		name: book.name,
		publisher: book.publisher,
	}));

	const response = h.response({
		status: 'success',
		data: {books: booksList},
	});
	return response;
	// Const bookList = books.map(())
};

// NOTE : Get Book By ID
const getBookById = (request, h) => {
	const {bookId} = request.params;
	const book = books.filter(book => book.id === bookId)[0];

	if (book !== undefined) {
		return {status: 'success', data: {book}};
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});
	response.code(404);
	return response;
};

// NOTE : Delete Book By ID
const deleteBookByID = (request, h) => {
	const {bookId} = request.params;
	const index = books.findIndex(book => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

// NOTE : Update book by id
const updateBookByID = (request, h) => {
	const {bookId} = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const updatedAt = new Date().toISOString();
	const index = books.findIndex(book => book.id === bookId);

	if (index !== -1) {
		// NOTE : no name
		if (name === undefined) {
			const response = h.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			});
			response.code(400);
			return response;
		}

		// NOTE : readPage lebih besar dari jumlah halaman
		if (readPage > pageCount) {
			const response = h.response({
				status: 'fail',
				message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			});
			response.code(400);
			return response;
		}

		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

module.exports = {
	addBooksHandler,
	listAllBooksHandler,
	getBookById,
	deleteBookByID,
	updateBookByID,
};
