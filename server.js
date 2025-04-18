const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Enable CORS to allow requests from frontend (especially if frontend and backend are on different ports)
app.use(cors());

// Path to the data file (where votes are stored)
const dataFilePath = './data.json';

// API to handle voting (POST request)
app.post('/api/vote', (req, res) => {
    const { actor, movie } = req.body;  // Ensure these match the keys sent from the frontend

    if (!actor || !movie) {
        return res.status(400).json({ message: "Both actor and movie are required." });
    }

    // Read the current data from the JSON file
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Failed to read data." });

        const votes = JSON.parse(data);

        // Check if this vote already exists
        const existingVote = votes.find(vote => vote.actor === actor && vote.movie === movie);
        if (existingVote) {
            existingVote.count += 1;  // If exists, increment the count
        } else {
            // Otherwise, add a new vote
            votes.push({ id: Date.now().toString(), actor, movie, count: 1 });
        }

        // Write the updated votes back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify(votes, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ message: "Failed to update data." });
            res.status(200).json({ message: "Vote recorded successfully!" });
        });
    });
});

// API to get the history of votes (GET request)
app.get('/api/history', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Failed to read data." });
        const votes = JSON.parse(data);
        res.status(200).json(votes);  // Send the votes as a JSON response
    });
});

// API to delete a vote entry by ID (DELETE request)
app.delete('/api/history/:id', (req, res) => {
    const { id } = req.params;

    // Read the current data from the JSON file
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Failed to read data." });

        let votes = JSON.parse(data);
        votes = votes.filter(vote => vote.id !== id);  // Remove the vote with the given ID

        // Write the updated list of votes back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify(votes, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ message: "Failed to update data." });
            res.status(200).json({ message: "History item deleted successfully." });
        });
    });
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
