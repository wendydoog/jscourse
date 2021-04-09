const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json());

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
  ];
  
app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')

    //genre.name = req.boby.name;
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const result = validateGenre(req.boby);
    if (result.error != null) return res.status(400).send(result.error.details[0].message);

    const genre = {
      id: genres.length + 1,
      name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
  });


function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));