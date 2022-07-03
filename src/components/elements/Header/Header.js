import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="rmdb-header">
      <div className="rmdb-header-content">
        <Link to="/">
          <img
            className="rmdb-logo"
            src="./images/reactMovie_logo.png"
            alt="rmdb-logo"
          />
        </Link>

        <img
          className="rmdb-tmdb-logo"
          src="./images/tmdb.svg"
          alt="tmdb-logo"
        />
      </div>
    </div>
  );
};

export default Header;
