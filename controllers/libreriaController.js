const { Books } = require('../models');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const bookSchema = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    price: Joi.number().required(),
    editory: Joi.string().required(),
    autor: Joi.string().required(),
    image: Joi.string().optional()
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

module.exports = {
    getBooks: async (req, res) => {
        try {
            const books = await Books.findAll();
            return res.status(200).send({ message: 'Books retrieved successfully', data: books });
        } catch (err) {
            return res.status(500).send({ errors: 'Error retrieving books' + err });
        }
    },

    createBooks: [
        upload.single('image'),
        async (req, res) => {
            const { name, gender, price, editory, autor } = req.body;
            const image = req.file ? req.file.filename : null;

            const { error } = bookSchema.validate({ name, gender, price, editory, autor, image });
            if (error) {
                return res.status(400).send({ errors: error.details[0].message });
            }

            try {
                const book = await Books.create({ name, gender, price, editory, autor, image });
                return res.status(201).send({ message: 'Book created successfully', data: book });
            } catch (err) {
                return res.status(500).send({ errors: 'Error creating book: ' + err });
            }
        }
    ],

    updateBooks: [
        upload.single('image'),
        async (req, res) => {
            const { id } = req.params;
            const { name, gender, price, editory, autor } = req.body;
    
            if (!id || isNaN(id)) {
                return res.status(400).send({ errors: 'Invalid or missing ID' });
            }
    
            const { error } = bookSchema.validate({ name, gender, price, editory, autor });
            if (error) {
                return res.status(400).send({ errors: error.details[0].message });
            }
    
            try {
                const book = await Books.findOne({ where: { id } });
                if (!book) {
                    return res.status(404).send({ errors: 'Book not found' });
                }


                if (req.file) {
                    const newImage = req.file.filename;

                    if (book.image) {
                        const oldImagePath = path.join(__dirname, '../public/images', book.image);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    }
    
                    // Actualiza la imagen y otros datos
                    await book.update({ name, gender, price, editory, autor, image: newImage });
                } else {
                    // Si no hay nueva imagen, solo actualiza otros datos
                    await book.update({ name, gender, price, editory, autor });
                }
    
                return res.status(200).send({ message: 'Book updated successfully', data: book });
            } catch (err) {
                return res.status(500).send({ errors: 'Error updating book: ' + err });
            }
        }
    ],
    getBook: async (req, res) => {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).send({ errors: 'Invalid or missing ID' });
        }

        try {
            const book = await Books.findOne({ where: { id } });
            if (!book) {
                return res.status(404).send({ errors: 'Book not found' });
            }

            return res.status(200).send({ message: 'Book retrieved successfully', data: book });
        } catch (err) {
            return res.status(500).send({ errors: 'Error retrieving book: ' + err });
        }
    },

    deleteBooks: async (req, res) => {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).send({ errors: 'Invalid or missing ID' });
        }

        try {
            const book = await Books.findOne({ where: { id } });
            if (!book) {
                return res.status(404).send({ errors: 'Book not found' });
            }

            try {
                if (book.image) {
                    const oldImagePath = path.join(__dirname, '../public/images', book.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log('Imagen eliminada:', oldImagePath);
                    }
                }
            } catch (err) {
                console.error('Error al eliminar la imagen:', err);
            }

            await book.destroy();
            return res.status(200).send({ message: 'Book deleted successfully', data: book });
        } catch (err) {
            return res.status(500).send({ errors: 'Error deleting book: ' + err });
        }
    },
    
};
