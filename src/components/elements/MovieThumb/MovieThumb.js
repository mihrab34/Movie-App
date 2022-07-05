import { Link } from "react-router-dom";
import PropTypes from "prop-types"
import "./MovieThumb.css";

const MovieThumb = (props) => {
  const {image, movieId, movieName } = props;
  return (
    <div className="rmdb-moviethumb">
      {props.clickable ? (
        <Link to={{ pathname: `/${movieId}`, movieName: `${movieName}` }} >
          <img src={image} alt="moviethumb" />
        </Link>
      ) : (
        <img src={image} alt="moviethumb" />
      )}
    </div>
  );
};

MovieThumb.propTypes = {
  image: PropTypes.string,
  movieId: PropTypes.number,
  movieName: PropTypes.string
}
export default MovieThumb;
