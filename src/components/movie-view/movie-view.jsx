import React from 'react';
import PropTypes from 'prop-types';

export class MovieView extends React.Component {
    keypressCallback(event) {
        console.log(event.key);
    }
    componentDidMount() {
        document.addEventListener('keypress', this.keypressCallback);
    }

    componentWilUnmount() {
        document.removeEventListener('keypress', this.keypressCallback);
    }

    render() {
        const { movie, onBackClick } = this.props;
        return (
            <div className="movie-view">
                <div className="movie-poster">
                    <img src={movie.ImagePath} />
                </div>
                <div className="movie-title">
                    <span className="label">Title:</span>
                    <span className="value">{movie.Title}</span>
                </div>
                <div className="movie-description">
                    <span className="label">Description: </span>
                    <span className="value">{movie.Description}</span>
                </div>
                <button onClick={() => { onBackClick(null); }}>Back</button>
            </div>
        );
    }
}

MovieView.propTypes = {
    movie: PropTypes.shape({
        ImagePath: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};