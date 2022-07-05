import PropTypes from "prop-types";
import './LoadMoreBtn.css';

const LoadMoreBtn = (props) => {
    return (
        <div className="rmdb-loadmorebtn" onClick={props.onClick}>
           <p>{props.text}</p>
        </div>
    )
}

LoadMoreBtn.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func
}

export default LoadMoreBtn;