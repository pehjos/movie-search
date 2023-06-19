// Search form element references
const searchFormElement = document.getElementById('search-form');
const searchInputElement = document.getElementById('search-input');

// Results container reference
const resultsContainerElement = document.getElementById('results');

// Loader element reference
const loaderElement = document.getElementById('loader');

// Event listener for search form submission
searchFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInputElement.value.trim();
  if (query === '') {
    return;
  }
  resultsContainerElement.innerHTML = ''; // Clear previous results
  showLoader();
  const movies = await fetchMovies(query);
  hideLoader();
  displayResults(movies);
});

// Infinite scrolling event listener
window.addEventListener('scroll', async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    const query = searchInputElement.value.trim();
    const currentPage = Math.ceil(resultsContainerElement.children.length / 10) + 1;
    showLoader();
    const movies = await fetchMovies(query, currentPage);
    hideLoader();
    displayResults(movies);
  }
});

// Function to show the loader
function showLoader() {
  loaderElement.style.display = 'block';
}

// Function to hide the loader
function hideLoader() {
  loaderElement.style.display = 'none';
}

// Array of random movie titles
const initialMovieTitles = [
  'Matrix',
  'Inception',
  'Knight',
  'Interstellar',
  'Fiction',
  'Fight',
  'Redemption',
  'Goodfellas',
  'Godfather',
  'Forrest',
  "Batman",
  "Ironman",
  "spiderman",
];

// Function to generate a random movie title
function getRandomMovieTitle() {
  const randomIndex = Math.floor(Math.random() * initialMovieTitles.length);
  return initialMovieTitles[randomIndex];
}

// Function to load initial movies on page load
function loadInitialMovies() {
  const initialQuery = getRandomMovieTitle();
  searchInputElement.value = initialQuery;
  fetchMovies(initialQuery)
    .then((movies) => {
      console.log(movies);
      displayResults(movies);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Execute the loadInitialMovies function when the page has finished loading
window.addEventListener('load', loadInitialMovies);

// Event listener for sorting by option change
const sortBySelectElement = document.getElementById('sort-by');
sortBySelectElement.addEventListener('change', () => {
  const selectedSortBy = sortBySelectElement.value;
  const query = searchInputElement.value;
  fetchMovies(query, 1, selectedSortBy)
    .then((movies) => {
      resultsContainerElement.innerHTML = ''; // Clear previous results
      let newData = movies.slice(); // Create a copy of the movies array
      switch (selectedSortBy) {
        case "relevance":
          newData.sort((a, b) => b.Poster.length - a.Poster.length);
          break;
        case "title":
          newData.sort((a, b) => a.Title.localeCompare(b.Title));
          break;
        case "year":
          newData.sort((a, b) => Number(a.Year) - Number(b.Year));
          break;
        default:
          break;
      }
      displayResults(newData);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

// Event listener for filtering by type option change
const sortByTypeElement = document.getElementById('filter-type');
sortByTypeElement.addEventListener('change', () => {
  const selectedType = sortByTypeElement.value;
  const query = searchInputElement.value;
  fetchMovies(query, 1, sortBySelectElement.value, selectedType)
    .then((movies) => {
      resultsContainerElement.innerHTML = ''; // Clear previous results
      displayResults(movies);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

// Event listener for filter button click
const filterButtonElement = document.getElementById('filter-button');
const filterBarElement = document.querySelector('.filter-bar');
filterButtonElement.addEventListener('click', () => {
  let display = filterBarElement.style.display;
  if (display === 'none') {
    filterBarElement.style.display = 'flex';
  } else {
    filterBarElement.style.display = 'none';
    sortBySelectElement.value = 'relevance';
    sortByTypeElement.value = 'movie';
  }
});

// Function to fetch movie data from the API
async function fetchMovies(query, page = 1, sortBy = 'relevance', type = 'movie') {
  const url = `${API_URL}&s=${encodeURIComponent(query)}&page=${page}&type=${type}&sort=${sortBy}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok && data && data.Search) {
      return data.Search;
    } else {
      throw new Error('Failed to fetch movies');
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to create a movie card element
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');

  const img = document.createElement('img');
  img.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://picsum.photos/200/300?grayscale';
  movieCard.appendChild(img);

  const title = document.createElement('h2');
  title.textContent = movie.Title;
  movieCard.appendChild(title);

  const year = document.createElement('p');
  year.textContent = movie.Year;
  movieCard.appendChild(year);

  const detailsButton = document.createElement('button');
  detailsButton.textContent = 'Movie Details';
  detailsButton.addEventListener('click', () => {
    displayMovieDetails(movie.imdbID);
  });
  movieCard.appendChild(detailsButton);

  return movieCard;
}

// Function to display movie results
function displayResults(movies = []) {
  if (movies.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No search results found.';
    resultsContainerElement.appendChild(message);
    return;
  }

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    resultsContainerElement.appendChild(movieCard);
  });
}

// Function to redirect and display movie details
function displayMovieDetails(imdbID) {
  const url = `movie-details.html?imdbID=${imdbID}`;
  window.location.href = url;
}
