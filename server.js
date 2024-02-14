const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'notes.html'))
);

app.get('/api/notes', (req, res) =>
    console.info(`${req.method} request recieved.`)
);

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved.`)

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        fs.readFile(path.join('/db' , 'db.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                
                fs.writeFile(path.join('/db' , 'db.json'), JSON.stringify(parsedNotes, null, 4), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.info('Notes updated');
                    }
                });
            }
        });
    }

});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'index.html'))
);

app.listen(PORT, () =>
    console.log(`Listenting at http://localhost:${PORT}`)
);