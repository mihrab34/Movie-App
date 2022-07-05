import React, { Component, useState, useEffect } from "react";
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

// function useMergeState(initialState) {
//   const [state, setState] = useState(initialState);
//   const setMergedState = (newState) =>
//     setState((prevState) => Object.assign({}, prevState, newState));
//   return [state, setMergedState];
// }

// function Home() {
//   const [homepage, setHomepage] = useMergeState({
//     movies: [],
//     heroImage: null,
//     loading: false,
//     currentPage: 0,
//     totalPages: 0,
//     searchTerm: "",
//   });

//   useEffect(() => {
//     setHomepage({ loading: true });
//     const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
//     fetchItems(endpoint);
//   }, []);

//   const searchItems = (searchTerm) => {
//     let endpoint = "";
//     setHomepage({
//       movies: [],
//       loading: true,
//       searchTerm,
//     });
//     if (searchTerm === "") {
//       endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
//     } else {
//       endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
//     }
//     fetchItems(endpoint);
//   };

//   const loadMoreItems = async() => {
//     let endpoint = "";
//     setHomepage({ loading: true });
//     if (homepage.searchTerm === "") {
//       endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
//         homepage.currentPage + 1
//       }`;
//     } else {
//       endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${
//         homepage.searchTerm
//       }&page=${homepage.currentPage + 1}`;
//     }
//     await fetchItems(endpoint);
//   };

//   const fetchItems = async(endpoint) => {
//     const response = await(await fetch(endpoint)).json();
//
//         setHomepage({
//           movies: [...homepage.movies, ...response.results],
//           heroImage: homepage.heroImage || response.results[4],
//           loading: false,
//           currentPage: response.page,
//           totalPages: response.total_pages,
//         });
//
//   };

//   const { movies, heroImage, loading, currentPage, totalPages, searchTerm } =
//     homepage;

//   return (
//     <div className="rmdb-home">
//       {heroImage ? (
//         <div>
//           <HeroImage
//             image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
//             title={heroImage.original_title}
//             text={heroImage.overview}
//           />
//           <SearchBar callback={searchItems} />
//         </div>
//       ) : null}
//       <div className="rmdb-home-grid">
//         <FourColGrid
//           header={searchTerm ? "Search Result" : "Popular Movies"}
//           loading={loading}
//         >
//           {movies.map((element, i) => {
//             return (
//               <MovieThumb
//                 key={i}
//                 clickable={true}
//                 image={
//                   element.poster_path
//                     ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
//                     : "./images/no_image.jpg"
//                 }
//                 movieId={element.id}
//                 movieName={element.original_title}
//               />
//             );
//           })}
//         </FourColGrid>
//         {loading ? <Spinner /> : null}
//         {currentPage <= totalPages && !loading ? (
//           <LoadMoreBtn text="Load More" onClick={loadMoreItems} />
//         ) : null}
//       </div>
//     </div>
//   );
// }

class Home extends Component {
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: "",
  };

  componentDidMount() {
    if (localStorage.getItem("HomeState")) {
      const state = JSON.parse(localStorage.getItem("HomeState"));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      this.fetchItems(endpoint);
    }
  }

  /**
   *
   * @param {searchValue} searchTerm
   * return the fetchItems method with the appropriate endpoint
   *
   * if there's a search value, it will return the endpoint with a query parameter
   */
  searchItems = (searchTerm) => {
    // console.log(searchTerm);
    let endpoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm,
    });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }
    this.fetchItems(endpoint);
  };

  loadMoreItems = () => {
    let endpoint = "";
    this.setState({ loading: true });
    if (this.state.searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
        this.state.currentPage + 1
      }`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${
        this.state.searchTerm
      }&page=${this.state.currentPage + 1}`;
    }
    this.fetchItems(endpoint);
  };

  fetchItems = async (endpoint) => {
    const { movies, heroImage, searchTerm } = this.state;
    try {
      const response = await (await fetch(endpoint)).json();
      this.setState(
        {
          movies: [...movies, ...response.results],
          heroImage: heroImage || response.results[4],
          loading: false,
          currentPage: response.page,
          totalPages: response.total_pages,
        },
        () => {
          if (searchTerm === "") {
            localStorage.setItem("HomeState", JSON.stringify(this.state));
          }
        }
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  render() {
    const { heroImage, loading, searchTerm, movies, currentPage, totalPages } =
      this.state;
    return (
      <div className="rmdb-home">
        {heroImage ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
            <SearchBar callback={this.searchItems} />
          </div>
        ) : null}
        <div className="rmdb-home-grid">
          <FourColGrid
            header={searchTerm ? "Search Result" : "Popular Movies"}
            loading={loading}
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
          {loading ? <Spinner /> : null}
          {currentPage <= totalPages && !loading ? (
            <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
