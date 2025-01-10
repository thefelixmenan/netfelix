import TmdbApi from './TmdbApi.js';

const api = new TmdbApi('bddb057839f224f5c11504e5529bf352');
let currentPage = 1;
let totalPages = 1;
let currentQuery = '';
let currentLanguage = 'en-US';

document.addEventListener("DOMContentLoaded", function() {
  const introOverlay = document.getElementById("introOverlay");
  const mainContent = document.getElementById("mainContent");
  const introVideo = document.getElementById("introVideo");

  introVideo.addEventListener("ended", function() {
    introOverlay.style.opacity = 0;
    mainContent.style.opacity = 1;
    setTimeout(() => {
      introOverlay.style.display = "none";
    }, 5000);
  });
});

document.getElementById('searchForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('Form submitted');
  currentQuery = document.getElementById('searchInput').value;
  currentLanguage = document.getElementById('languageSelect').value;
  console.log('Search query:', currentQuery);
  console.log('Selected language:', currentLanguage);
  currentPage = 1;
  await fetchAndDisplayMovies(currentQuery, currentPage, currentLanguage);
});

document.getElementById('resetButton').addEventListener('click', async () => {
  document.getElementById('searchInput').value = '';
  currentQuery = '';
  currentLanguage = document.getElementById('languageSelect').value;
  console.log('Reset button clicked');
  await fetchAndDisplayDiscoverMovies(currentLanguage);
});

document.getElementById('languageSelect').addEventListener('change', async () => {
  currentLanguage = document.getElementById('languageSelect').value;
  console.log('Language changed:', currentLanguage);
  if (currentQuery) {
    await fetchAndDisplayMovies(currentQuery, currentPage, currentLanguage);
  } else {
    await fetchAndDisplayDiscoverMovies(currentLanguage);
  }
});

async function fetchAndDisplayMovies(query, page, language) {
  try {
    const data = await api.searchMovies(query, page, language);
    const movies = data.results;
    totalPages = data.total_pages;
    console.log('Movies:', movies);
    if (movies) {
      const resultsList = document.getElementById('resultsList');
      resultsList.innerHTML = '';
      movies.forEach(movie => {
        const listItem = document.createElement('li');
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
        listItem.innerHTML = `<img src="${posterUrl}" alt="${movie.title} poster"><p>${movie.title}</p>`;
        resultsList.appendChild(listItem);
      });
      displayPagination();
    } else {
      console.error('No movies found');
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

async function fetchAndDisplayDiscoverMovies(language) {
  try {
    const movies = await api.discoverMovies(language);
    console.log('Discover movies:', movies);
    if (movies) {
      const resultsList = document.getElementById('resultsList');
      resultsList.innerHTML = '';
      movies.forEach(movie => {
        const listItem = document.createElement('li');
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
        listItem.innerHTML = `<img src="${posterUrl}" alt="${movie.title} poster"><p>${movie.title}</p>`;
        resultsList.appendChild(listItem);
      });
    } else {
      console.error('No discover movies found');
    }
  } catch (error) {
    console.error('Error fetching discover movies:', error);
  }
}

function displayPagination() {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Précédent';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      await fetchAndDisplayMovies(currentQuery, currentPage, currentLanguage);
    }
  });
  paginationContainer.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Suivant';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', async () => {
    if (currentPage < totalPages) {
      currentPage++;
      await fetchAndDisplayMovies(currentQuery, currentPage, currentLanguage);
    }
  });
  paginationContainer.appendChild(nextButton);

  const lastButton = document.createElement('button');
  lastButton.textContent = 'Dernier';
  lastButton.disabled = currentPage === totalPages;
  lastButton.addEventListener('click', async () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      await fetchAndDisplayMovies(currentQuery, currentPage, currentLanguage);
    }
  });
  paginationContainer.appendChild(lastButton);
}

(async () => {
  currentLanguage = document.getElementById('languageSelect').value;
  await fetchAndDisplayDiscoverMovies(currentLanguage);
})();