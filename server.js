const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved for notes.`)

    return res.json(notes);

});


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved.`)

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        notes.push(newNote);

        fs.writeFile(path.join('db', 'db.json'), JSON.stringify(notes, null, 4), (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
            } else {
                console.info('Notes updated');
                const response = {
                    status: 'success',
                    body: newNote,
                };
                console.log(response);
                res.status(201).json(response);
            }
        });

    }
    else {
        res.status(500).json('Error in posting');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} received.`)
    const id = req.params.id;
    const noteToDelete = notes.find(el => el.note_id === id);
    console.log(id + " not to Delete " + noteToDelete)

    if (!noteToDelete) {
        console.log('Could not find note by id')
        return res.status(404).json({
            status: 'fail',
            message: 'No note with ID ' + id + ' is found'
        })

    }
    const index = notes.indexOf(noteToDelete);

    notes.splice(index, 1);

    fs.writeFile(path.join('db', 'db.json'), JSON.stringify(notes, null, 4), (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
        } else {
            console.info('Notes updated');
            return res.json(notes);
        }
    });

});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Listenting at http://localhost:${PORT}`)
);