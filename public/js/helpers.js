// Function to create a movie card element
function createMovieCard(movie) {
  const movieCardElement = document.createElement('div');
  movieCardElement.classList.add('movie-card');

  const imgElement = document.createElement('img');
  imgElement.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://picsum.photos/200/300?grayscale';
  movieCardElement.appendChild(imgElement);

  const titleElement = document.createElement('h2');
  titleElement.textContent = movie.Title;
  movieCardElement.appendChild(titleElement);

  const yearElement = document.createElement('p');
  yearElement.textContent = movie.Year;
  movieCardElement.appendChild(yearElement);

  const detailsButtonElement = document.createElement('button');
  detailsButtonElement.textContent = 'Movie Details';
  detailsButtonElement.addEventListener('click', () => {
    displayMovieDetails(movie.imdbID);
  });
  movieCardElement.appendChild(detailsButtonElement);

  return movieCardElement;
}

// Function to fetch movie data from the API
async function fetchMovies(query, page = 1, sortBy = 'relevance', type = 'movie') {
  let url = `${API_URL}&s=${encodeURIComponent(query)}&page=${page}&type=${type}&sort=${sortBy}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Search;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to fetch related movies from the API
async function fetchRelatedMovies(title) {
  const url = `${API_URL}&s=${encodeURIComponent(title)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Search;
  } catch (error) {
    throw new Error('Failed to fetch related movies');
  }
}

// Function to fetch movie details from the API
async function fetchMovieDetails(imdbID) {
  const url = `${API_URL}&i=${imdbID}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Function to display movie results
function displayResults(movies = []) {
  const resultsContainerElement = document.getElementById('results');

  if (movies.length == 0) {
    const messageElement = document.createElement('p');
    messageElement.textContent = 'No search Results Found.';
    resultsContainerElement.appendChild(messageElement);
    return;
  }

  movies.forEach((movie) => {
    const movieCardElement = createMovieCard(movie);
    resultsContainerElement.appendChild(movieCardElement);
  });
}

// Function to redirect and display movie details
function displayMovieDetails(imdbID) {
  const url = `movie-details.html?imdbID=${imdbID}`;
  window.location.href = url;
}
