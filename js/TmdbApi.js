class TmdbApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  async discoverMovies(language = 'en-US') {
    try {
      const response = await fetch(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=${language}`);
      const data = await response.json();
      console.log('Discover Movies API Response:', data);
      return data.results;
    } catch (error) {
      console.error('Error in discoverMovies:', error);
    }
  }

  async searchMovies(query, page = 1, language = 'en-US') {
    try {
      const response = await fetch(`${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=${language}&api_key=${this.apiKey}`);
      const data = await response.json();
      console.log('Search Movies API Response:', data);
      return data;
    } catch (error) {
      console.error('Error in searchMovies:', error);
    }
  }
}

export default TmdbApi;