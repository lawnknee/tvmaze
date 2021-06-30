"use strict";

/* GLOBAL variables */
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $term = $("#searchForm-term").val();
const $baseURL = 'http://api.tvmaze.com/search/'

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // make request to TVMaze search shows API.
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`); 
  // give base URL global variable

  let shows = response.data;
  let formattedArray = []; // rename. 
  
  /* iterates through the showArray and narrowing each show object to specific properties we want */

  // debugger;
  for(let showObj of shows) { // rename showObj, consider just 's', and using .map() method
    // let image;
    // if(!image) {
    //   image = 'https://tinyurl.com/tv-missing'
    // } else {
    //   image = image.medium;
    // }

    let { id, name, summary, image } = showObj.show;

    image = (image) ? image.medium : 'https://tinyurl.com/tv-missing';
    // put default URL into global variable

    let newShowObj = { // rename newShowObj
      id,
      name,
      summary,
      image,
    }
    formattedArray.push(newShowObj);
  }
  return formattedArray;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  /* iterates through each show and populates just the show id, image, name, summary */
  for (let { id, image, name, summary } of shows) { // replaced show with { id, image, name, summary }
    
    const $show = $(
        `<div data-show-id="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${image}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${name}</h5>
             <div><small>${summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);
    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes after 'Episodes' button is clicked:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = response.data;

  let formattedEpisodes = [];

  for (let episode of episodes) {
    let { id, name, season, number } = episode;
    
    let newEpisodeObj = {
      id,
      name,
      season,
      number,
    }
    formattedEpisodes.push(newEpisodeObj);
  }
  console.log(formattedEpisodes);
  return formattedEpisodes;
}
getEpisodesOfShow(139);

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
