const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));

app.get('/api/notes',(req,res) => {
    fs.readFile(path.join(__dirname,'db/db.json'),(err,data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});
app.post('/api/notes',(req,res) => {
    let newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile('db/db.json',(err,data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('db/db.json',JSON.stringify(notes),(err) => err ? console.err(err) : console.log('note added!'));
    });
    res.end();
});
app.delete('/api/notes/:id',(req,res) => {
    fs.readFile('db/db.json',(err,data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes.forEach(note => {
            if (note.id === req.params.id) {
                notes.splice(notes.indexOf(note),1);
            }
        });
        fs.writeFile('db/db.json',JSON.stringify(notes),(err) => err ? console.err(err) : console.log('note deleted!'));
    });
    res.end();
});

app.get('/notes', (req,res) => res.sendFile(path.join(__dirname,'public/notes.html')));
app.get('*', (req,res) => res.sendFile(path.join(__dirname,'public/index.html')));

app.listen(PORT, () => {
    console.log('server is running'); 
});