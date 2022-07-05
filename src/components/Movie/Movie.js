import React, { Component, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Spinner from "../elements/Spinner/Spinner";
import Actor from "../elements/Actor/Actor";

import "./Movie.css";

function Movie(props) {
  const [movieDetails, setMovieDetails] = useState({
    movie: null,
    actors: null,
    directors: [],
    loading: false,
  });
  const { movieId } = useParams();
  useEffect(() => {
    if (sessionStorage.getItem(`${movieId}`)) {
      const state = JSON.parse(sessionStorage.getItem(`${movieId}`));
      setMovieDetails({ ...state });
    } else {
      setMovieDetails({ loading: true });
      // fetching movie
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      fetchItems(endpoint);
    }
  }, []);


  const fetchItems = async (endpoint) => {
    try {
      const result = await (await fetch(endpoint)).json();
      if (result.status_code) {
        setMovieDetails({ loading: false });
      } else {
        setMovieDetails({ movie: result });
        // then fetch movie actors after setting state of movie function
        let creditEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const response = await (await fetch(creditEndpoint)).json();
        const directors = response.crew.filter(
          (member) => member.job === "Director"
        );
        setMovieDetails({
            actors: response.cast,
            directors,
            loading: false,
          })
            sessionStorage.setItem(`${movieId}`, JSON.stringify(movieDetails));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  console.log("Moviecomp:", movieDetails);
  const { movie, actors, directors, loading }  = movieDetails;
  return (
    <div className="rmdb-movie">
      {movie ? (
        <div>
          <Navigation movie={props.location.movieName} />
          <MovieInfo movie={movie} directors={directors} />
          <MovieInfoBar
            time={movie.runtime}
            budget={movie.budget}
            revenue={movie.revenue}
          />
        </div>
      ) : null}
      {actors ? (
        <div className="rmdb-movie-grid">
          <FourColGrid header={"Actors"}>
            {actors.map((element, i) => {
              return <Actor key={i} actor={element} />;
            })}
          </FourColGrid>
        </div>
      ) : null}
      {!actors && !loading ? <h1>No Actors Found</h1> : null}
      {loading ? <Spinner /> : null}
    </div>
  );
}

// class Movie extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       movie: null,
//       actors: null,
//       directors: [],
//       loading: false,
//     };
//   }

//   componentDidMount() {
//     const { movieId } = this.props.match.params;
//     if (sessionStorage.getItem(`${movieId}`)) {
//       const state = JSON.parse(sessionStorage.getItem(`${movieId}`));
//       this.setState({ ...state });
//     } else {
//       this.setState({ loading: true });
//       // fetching movie
//       const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
//       this.fetchItems(endpoint);
//     }
//   }

//   fetchItems = async (endpoint) => {
//     const { movieId } = this.props.match.params;
//     try {
//       const result = await (await fetch(endpoint)).json();
//       if (result.status_code) {
//         this.setState({ loading: false });
//       } else {
//         this.setState({ movie: result });
//         // then fetch movie actors after setting state of movie function
//         let creditEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
//         const response = await (await fetch(creditEndpoint)).json();
//         const directors = response.crew.filter(
//           (member) => member.job === "Director"
//         );
//         this.setState(
//           {
//             actors: response.cast,
//             directors,
//             loading: false,
//           },
//           () => {
//             sessionStorage.setItem(`${movieId}`, JSON.stringify(this.state));
//           }
//         );
//       }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };
//   render() {
//     const { movie, actors, directors, loading } = this.state;
//     return (
//       <div className="rmdb-movie">
//         {movie ? (
//           <div>
//             <Navigation movie={this.props.location.movieName} />
//             <MovieInfo movie={movie} directors={directors} />
//             <MovieInfoBar
//               time={movie.runtime}
//               budget={movie.budget}
//               revenue={movie.revenue}
//             />
//           </div>
//         ) : null}
//         {actors ? (
//           <div className="rmdb-movie-grid">
//             <FourColGrid header={"Actors"}>
//               {actors.map((element, i) => {
//                 return <Actor key={i} actor={element} />;
//               })}
//             </FourColGrid>
//           </div>
//         ) : null}
//         {!actors && !loading ? <h1>No Actors Found</h1> : null}
//         {loading ? <Spinner /> : null}
//       </div>
//     );
//   }
// }

// Movie = withRouter(Movie);
export default Movie;
