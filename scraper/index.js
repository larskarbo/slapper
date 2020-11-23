

//scraper.js

const axios = require("axios").default;

const fetchHtml = async url => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};



const $ = require("cheerio");

const scrapSteam = async () => {
  const url =
    "https://www.tunefind.com/browse/movie";

  const html = await fetchHtml(url);

  const selector = $.load(html);

  // Here we are telling $ that the "<a>" collection 
  //is inside a div with id 'search_resultsRows' and 
  //this div is inside other with id 'search_result_container'.
  //So,'searchResults' is an array of $ objects with "<a>" elements
  const searchResults = selector(".Tunefind__Content")
      .find("a")

  console.log(searchResults.length)

  for (let i = 0; i < searchResults.length; i++) {
    const element = searchResults[i];
    const href = $(element).attr("href")
    scrapMovie(href)
  }

  // Don't worry about this for now

};
scrapSteam()


const scrapMovie = async (eurl) => {
  const url =
    "https://www.tunefind.com" + eurl;

  const html = await fetchHtml(url);

  const selector = $.load(html);

  // Here we are telling $ that the "<a>" collection 
  //is inside a div with id 'search_resultsRows' and 
  //this div is inside other with id 'search_result_container'.
  //So,'searchResults' is an array of $ objects with "<a>" elements
  const searchResults = selector(".Tunefind__Content")
      .find("h4")

  
  for (let i = 0; i < searchResults.length; i++) {
    const element = searchResults[i];
    const text = $(element).text()
  }
  console.log(eurl + " done")

  // Don't worry about this for now

};

// scrapMovie("/movie/adopt-a-highway-2019")