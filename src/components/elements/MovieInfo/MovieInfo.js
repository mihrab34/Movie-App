import { IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from "../../../config";
import FontAwesome from "react-fontawesome";
import MovieThumb from "../MovieThumb/MovieThumb";
import "./MovieInfo.css";

function MovieInfo(props) {
  const {backdrop_path, poster_path, title, overview, vote_average} = props.movie;
  const {directors} = props;
  return (
    <div
      className="rmdb-movieinfo"
      style={{
        backgroundImage: backdrop_path ? `url("${IMAGE_BASE_URL}${BACKDROP_SIZE}${backdrop_path}")`
          : "#000",
      }}
    >
      <div className="rmdb-movieinfo-content">
        <div className="rmdb-movieinfo-thumb">
          <MovieThumb
            image={
              poster_path
                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${poster_path}`
                : "./images/no_image.jpg"
            }
            clickable={false}
          />
        </div>

        <div className="rmdb-movieinfo-text">
          <h1>{title}</h1>
          <h3>PLOT</h3>
          <p>{overview}</p>
          <h3>IMDB RATING</h3>
          <div className="rmdb-rating">
            <meter min="0" max="100" optimum="100" low="40" high="70" value={vote_average * 10}></meter>
            <p className="rmdb-score">{vote_average *10}%</p>
          </div>
          {directors.length > 1? <h3>DIRECTORS</h3> : <h3>DIRECTOR</h3>}
          {directors.map((element, i) => {
            return <p key={i} className="rmdb-director">{element.name}</p>
          }
            )}
        </div>
        <FontAwesome className="fa-film" name="film" size="5x"></FontAwesome>
      </div>
    </div>
  );
}

export default MovieInfo;
