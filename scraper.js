
const cheerio = require('cheerio')
const fetch = require('node-fetch')

const searchURL = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieURL = 'https://www.imdb.com/title/'

function searchMovies(searchTerm) {
   return fetch(`${searchURL} ${searchTerm}`)         //search term is appended to q=
        .then(response => response.text())   //this converts response to text using shorthand function
        .then(body => {                       //"take body arg off response and then do the following"
            const movies = [];
            const $ = cheerio.load(body);
            $('.findResult').each(function(i,element) {     //iterate each element under .findResult element
                const $element = $(element);
                const $image = $element.find('td a img');
                const $title = $element.find('td.result_text a');
                const imdbID = $title.attr('href').match(/title\/(.*)\//[1])
                //$('meta [property="pageID"] content')
                
           //construct movie object and store in movies array    
                const movie = {
                    image: $image.attr('src'),
                    title: $title.text(),
                    imdbID
                };
                movies.push(movie)
            })
            return(movies)
        })
}

function getMovie(imdbID){
    return fetch(`${movieURL}${imdbID}`)
        .then(response => response.text())
        .then(body => {
           const $ = cheerio.load(body);
           const $title = $('.title_wrapper h1');

           const title = $title.first().contents().filter(function() {      //this gets text from parent element w/o children
               return this.type === 'text';
           }).text().trim();


           //getting rating,runtime, and genre from .subtext div on IMDB html page
                /*contents response structure: "PG\n","\n 2h 16min\n\n","\nAction, \nAdventure, \nFantasy\n","\n19 May 1999 (USA)" */
             let contents  = (($('.subtext').text().split('\n').join('')).replace(/\s+/g,' ').trim()).split('|')
            /*convert to text -> split at \n causing \n to be removed, then rejoin -> replace large space with normal space, and trim -> split at '|' and store as array */
                    const rating  =  contents[0].trim();
                    const runTime =  contents[1].trim();
                    const genres  =  contents[2].trim();
                    const releaseDate =  contents[3].trim();
            //get image
            const posterImg = $('.poster img ').attr('src')
            console.log(posterImg)

            //get summary
            const summary = $('.summary_text').text().trim();

            //get directory
            const directors = []
             $('.credit_summary_item a').first().each(function(i,element) {
                 const director = $(element).text().trim()
                 directors.push(director)
             })
            

           return {
               title,
               imdbID,
               rating,
               runTime,
               genres,
               releaseDate,
               posterImg,
               summary,
               directors
           };
        });
}


    
module.exports = {
    searchMovies,
    getMovie
}

