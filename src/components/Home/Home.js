import { useState, useEffect } from "react";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";
import "./Home.css";

const Home = () => {
  const [state, setState] = useState({ movies: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchMovies = async (endpoint) => {
    setIsError(false);
    setIsLoading(true);
    // we can use URLSEARCHPARAMS to get URL params
    const urlParams = new URLSearchParams(endpoint);
    if (!urlParams.get("page")) {
      setState((prev) => ({
        ...prev,
        movies: [],
        searchTerm: urlParams.get("query"),
      }));
    }
    try {
      const response = await (await fetch(endpoint)).json();
      setState((prev) => ({
        ...prev,
        movies: [...prev.movies, ...response.results],
        heroImage: prev.heroImage || response.results[4],
        currentPage: response.page,
        totalPages: response.total_pages,
      }));
      if (!state.searchTerm) {
        sessionStorage.setItem("HomeState", JSON.stringify(state));
      }
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("HomeState")) {
      const state = JSON.parse(sessionStorage.getItem("HomeState"));
      setState({...state });
    } else {
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}`;
      fetchMovies(endpoint);
    }
  }, []);

  // useEffect(() => {
  //   if (!state.searchTerm) {
  //     sessionStorage.setItem("HomeState", JSON.stringify(state));
  //   }
  // }, [state]);

  const searchItems = (searchTerm) => {
    let endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}`;

    if (!searchTerm) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}`;
    }

    fetchMovies(endpoint);
  };

  const loadMoreItems = () => {
    const { currentPage, searchTerm } = state;

    let endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${
      currentPage + 1
    }`;
    if (!searchTerm) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&page=${
        currentPage + 1
      }`;
    }
    fetchMovies(endpoint);
  };

  const { heroImage, searchTerm, movies, currentPage, totalPages } = state;

  return (
    <div className="rmdb-home">
      {heroImage && !searchTerm ? (
        <div>
          <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
            title={heroImage.original_title}
            text={heroImage.overview}
          />
        </div>
      ) : null}
      <SearchBar callback={searchItems} />
      <div className="rmdb-home-grid">
        <FourColGrid
          header={searchTerm ? "Search Result" : "Popular Movies"}
          loading={isLoading}
        >
          {movies.map((element, i) => {
            return (
              <MovieThumb
                key={i}
                clickable={true}
                image={
                  element.poster_path
                    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                    : "./images/no_image.jpg"
                }
                movieId={element.id}
                movieName={element.original_title}
              />
            );
          })}
        </FourColGrid>
        {isLoading ? <Spinner /> : null}
        {currentPage < totalPages && !isLoading ? (
          <LoadMoreBtn text="Load More" onClick={loadMoreItems} />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
