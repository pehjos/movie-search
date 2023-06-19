// Get the carousel container reference
const carouselContainer = document.getElementById('carousel');

// Fetch and display related movies in the carousel
async function fetchAndDisplayRelatedMovies(movieId) {
  const relatedMovies = await fetchRelatedMovies(movieId);
  displayRelatedMovies(relatedMovies);
}

// Function to fetch related movies from the API
async function fetchRelatedMovies(movieId) {
  const url = `${API_URL}&i=${encodeURIComponent(movieId)}&type=movie`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Search;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to display related movies in the carousel
function displayRelatedMovies(movies) {
  carouselContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    carouselContainer.appendChild(movieCard);
  });

  // Initialize the carousel
  initializeCarousel();
}

// Function to create a movie card element for the carousel
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('carousel-movie-card');

  const img = document.createElement('img');
  img.src = movie.Poster !== 'N/A' ? movie.Poster : 'no-poster.jpg';
  movieCard.appendChild(img);

  const title = document.createElement('p');
  title.textContent = movie.Title;
  movieCard.appendChild(title);

  movieCard.addEventListener('click', () => {
    window.location.href = `movie-details.html?id=${movie.imdbID}`;
  });

  return movieCard;
}

// Function to initialize the carousel
function initializeCarousel() {
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let position = 0;
  const slideWidth = 250; // Adjust as needed
  const slidesToShow = 4; // Adjust as needed

  // Set the initial position
  carousel.style.transform = `translateX(${position}px)`;

  // Move the carousel to the left
  const moveLeft = () => {
    position += slideWidth * slidesToShow;
    carousel.style.transform = `translateX(${position}px)`;
  };

  // Move the carousel to the right
  const moveRight = () => {
    position -= slideWidth * slidesToShow;
    carousel.style.transform = `translateX(${position}px)`;
  };

  // Add event listeners to the navigation buttons
  prevBtn.addEventListener('click', moveRight);
  nextBtn.addEventListener('click', moveLeft);
}

// Call the fetchAndDisplayRelatedMovies function when the page loads
fetchAndDisplayRelatedMovies(movieId);
