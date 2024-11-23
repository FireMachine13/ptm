const express = require('express');
const router = express.Router();
const libreriaController = require('../controllers/libreriaController');

router.get('/books', libreriaController.getBooks);
router.post('/books', libreriaController.createBooks);
router.put('/books/:id', libreriaController.updateBooks);
router.delete('/books/:id', libreriaController.deleteBooks);

module.exports = router;
// Endpoint para actualizar un libro
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, gender, editory, autor } = req.body;
  
    try {
      const updatedBook = await Books.update(
        { name, price, gender, editory, autor },
        { where: { id } }
      );
  
      if (updatedBook[0] > 0) {
        res.status(200).json({ message: 'Libro actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Libro no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      res.status(500).json({ message: 'Error al actualizar el libro' });
    }
  });
  