// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log(`Server started on port`, port);
});

// Route: Get all recipes
app.get('/allrecipes', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.recipes');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for all recipes'});
    }
});

// Route: Add a new recipe
app.post('/addrecipe', async (req, res) => {
    const { recipe_name, cuisine, prep_time } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO defaultdb.recipes (recipe_name, cuisine, prep_time) VALUES (?, ?, ?)',
            [recipe_name, cuisine, prep_time]
        );

        res.status(201).json({message: 'Recipe ' + recipe_name + ' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add recipe ' + recipe_name});
    }
});

// Route: Update a recipe
app.put('/editrecipe/:id', async (req, res) => {
    const { id } = req.params;
    const { recipe_name, cuisine, prep_time } = req.body;

    if (recipe_name === undefined && cuisine === undefined && prep_time === undefined) {
        return res.status(400).json({ message: 'Nothing to update' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            `UPDATE defaultdb.recipes 
             SET recipe_name = COALESCE(?, recipe_name),
                 cuisine = COALESCE(?, cuisine),
                 prep_time = COALESCE(?, prep_time),
             WHERE id = ?`,
            [recipe_name ?? null, cuisine ?? null, prep_time ?? null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe id ' + id + ' updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update recipe id ' + id });
    }
});

// Route: Delete a recipe
app.delete('/deleterecipe/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'DELETE FROM defaultdb.recipes WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe id ' + id + ' deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete recipe id ' + id });
    }
});
