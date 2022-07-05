import React, { Component, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Spinner from "../elements/Spinner/Spinner";
import Actor from "../elements/Actor/Actor";

import "./Movie.css";

// function Movie(props) {
//   const [movieDetails, setMovieDetails] = useState({
//     movie: null,
//     actors: null,
//     directors: [],
//     loading: false,
//   });
//   const { movieId } = useParams();
//   let endpoint;
//   useEffect(() => {
//     setMovieDetails({ loading: true });
//     // fetching movie
//     endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
//     fetchItems(endpoint);
//   }, []);

//   useEffect(() => {
//     // then fetch movie actors in the set state callback function
//     endpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
//     fetch(endpoint)
//       .then((result) => result.json())
//       .then((result) => {
//         const directors = result.crew.filter(
//           (member) => member.job === "Director"
//         );
//         setMovieDetails({
//           movie: result,
//           actors: result.cast,
//           directors,
//           loading: false,
//         });
//       });
//   }, []);

//   const fetchItems = (endpoint) => {
//     fetch(endpoint)
//       .then((result) => result.json())
//       .then((result) => {
//         if (result.status_code) {
//           setMovieDetails({ loading: false });
//         } else {
//           setMovieDetails({
//             movie: result,
//           }, ()=> {

// });
//         }
//       })
//       .catch((error) => console.log("Error:", error));
//   };
//   console.log("Moviecomp:", movieDetails);
//   const { movie, actors, directors } = movieDetails;
//   return (
//     <div className="rmdb-movie">
//       {movieDetails ? (
//         <div>
//           <Navigation />
//           <MovieInfo />
//           <MovieInfoBar />
//         </div>
//       ) : null}
//     </div>
//   );
// }

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      actors: null,
      directors: [],
      loading: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
      const state = JSON.parse(localStorage.getItem(`${this.props.match.params.movieId}`));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      // fetching movie
      const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems(endpoint) {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        if (result.status_code) {
          this.setState({ loading: false });
        } else {
          this.setState(
            {
              movie: result,
            },
            () => {
              // then fetch movie actors in the set state callback function
              endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;
              fetch(endpoint)
                .then((result) => result.json())
                .then((result) => {
                  const directors = result.crew.filter(
                    (member) => member.job === "Director"
                  );
                  this.setState({
                    actors: result.cast,
                    directors,
                    loading: false,
                  }, () => {
                    localStorage.setItem(`${this.props.match.params.movieId}`, JSON.stringify(this.state))
                  });
                });
            }
          );
        }
      })
      .catch((error) => console.log("Error:", error));
  }
  render() {
    return (
      <div className="rmdb-movie">
        {this.state.movie ? (
          <div>
            <Navigation movie={this.props.location.movieName} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.movie.runtime}
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div>
        ) : null}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {this.state.actors.map((element, i) => {
                return <Actor key={i} actor={element} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!this.state.actors && !this.state.loading ? <h1>No Movie Found</h1>: null}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}

Movie = withRouter(Movie);
export default Movie;
