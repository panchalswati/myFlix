import React from 'react';
import PropTypes from 'prop-types';
import { MovieView } from '../movie-view/movie-view';

export class MovieCard extends React.Component {
    render() {
        const { movie, onMovieClick } = this.props;
        return (
            <div className="movie-card" onClick={() => onMovieClick(movie)}>{movie.Title}</div>
        );
    }
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string.isRequired,
        }),
        Director: PropTypes.shape({
            name: PropTypes.string.isRequired,
            Birth: PropTypes.string.isRequired,
            Bio: PropTypes.string.isRequired,
        }),
        Feature: PropTypes.string.isRequired,
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired
};
