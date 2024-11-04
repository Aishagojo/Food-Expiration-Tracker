const express = require('express');
const connection = require('./db');  

const app = express();
app.use(express.json()); 

// Route to add a food item
app.post('/food', (req, res) => {
    const { name, expiration_date } = req.body;

    const query = 'INSERT INTO food_items (name, expiration_date) VALUES (?, ?)';
    connection.query(query, [name, expiration_date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: results.insertId, name, expiration_date });
    });
});

// Route to get all food items
app.get('/food', (req, res) => {
    connection.query('SELECT * FROM food_items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Route to update a food item by ID
app.put('/food/:id', (req, res) => {
    const { id } = req.params; 
    const { name, expiration_date } = req.body; 

    // Validate that both name and expiration_date are provided
    if (!name || !expiration_date) {
        return res.status(400).json({ error: 'Name and expiration date are required.' });
    }

    // SQL query to update the food item
    const query = 'UPDATE food_items SET name = ?, expiration_date = ? WHERE id = ?';
    connection.query(query, [name, expiration_date, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        // Check if the item was found and updated
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        // Respond with the updated food item
        res.status(200).json({ id, name, expiration_date });
    });
});

// Route to delete a food item by ID
app.delete('/food/:id', (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    const query = 'DELETE FROM food_items WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        res.status(204).send(); // No content to send back
    });
});

// Route to get a specific food item by ID
app.get('/food/:id', (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    const query = 'SELECT * FROM food_items WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        res.status(200).json(results[0]); // Send the found food item
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
