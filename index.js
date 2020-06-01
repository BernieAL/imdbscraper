const express = require('express');
const scraper = require('./scraper');
const cors = require('cors')

const app = express()
app.use(cors)


app.get('/',(req,res) => {
    res.json({
        message: 'Scraping is fun'
    })
})

app.get('/search/:title',(req,res) => {
    scraper
        .searchMovies(req.params.title)
        .then(movies => {
            res.json(movies)
        })
})

app.get('/movie/:imdbID',(req,res) => {
    scraper
        .getMovie(req.params.imdbID)
        .then(movies => {
            res.json(movies)
        })
})


app.listen(1337, ()=>{
    console.log("Server Running")
})



/*  
NOTES

//THIS: 

 .then((movies) => {
    
  })

  //IS THE SAME AS THIS, it just uses shorthand function:

  .then(movies => {

  })

  JUST LIKE THIS:

  .then(response => response.json())

  IS THE SAME AS :

  .then((response) {
        response.json
  }

  */