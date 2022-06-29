import React from 'react';
import axios from 'axios';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
    constructor() {
        super();
        this.state = {
            movies: [],
            selectedMovie: null,
            user: null
        }
    }

    componentDidMount() {
        axios.get(' https://myflix-movies-heroku.herokuapp.com/movies')
            .then(response => {
                this.setState({
                    movies: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    setSelectedMovie(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    onLoggedIn(user) {
        this.setState({
            user
        });
    }

    onRegisterIn(user) {
        this.setState({
            user
        });
    }

    render() {
        const { movies, selectedMovie, user } = this.state;
        {
            (!user)
                ? <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                : <RegistrationView onRegisterIn={user => this.onRegisterIn(user)} />
            if (movies.length === 0)
                return <div className="main-view" />;
        }

        return (
            <div className="main-view" >
                {
                    selectedMovie
                        ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }
                        } />
                        : movies.map(movie => (
                            <MovieCard key={movie._id} movie={movie} onMovieClick={(newSelectedMovie) => { this.setSelectedMovie(newSlectedMovie) }} />
                        ))
                },
                <button type="submit" onClick={this.onRegisterIn(user)}>Register Here</button>
            </div >
        );
    }
}