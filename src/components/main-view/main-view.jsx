import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom';

import {
    setMovies,
    setUser
} from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';

import { MenuBar } from '../navbar/navbar';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import ProfileView from '../profile-view/profile-view';
import { Container, Col, Row } from 'react-bootstrap';

import './main-view.scss';

export class MainView extends React.Component {
    constructor() {
        super();
        this.state = {
            movies: [],
            user: null,
            fullUser: {}
        };
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log(accessToken)
        if (accessToken !== null) {
            axios.get(`https://myflix-movies-heroku.herokuapp.com/users/${user}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
                .then(res => {
                    console.log(res)
                    const fullUser = res.data;
                    this.setState({
                        fullUser: fullUser,
                        user: localStorage.getItem('user')
                    })
                    this.getMovies(accessToken);
                })
                .catch(function (error) {
                    console.log(error)
                });
        }
    }

    setSelectedMovie(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    getMovies(token) {
        axios.get('https://myflix-movies-heroku.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                this.props.setMovies(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username
        });

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    //User logout
    onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
            user: null
        });
    }

    render() {

        const { user } = this.state;
        const { movies } = this.props;
        console.log('logged in: ', user);

        return (
            <Router>
                <MenuBar user={user} />
                <Container >
                    <Row className="main-view justify-content-md-center">

                        <Route exact path="/" render={() => {
                            if (!user && !localStorage.getItem('user')) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            return <MoviesList movies={movies} />
                        }} />

                        <Route path="/register" render={() => {
                            if (user) {
                                <Redirect to="/" />
                            }
                            return (
                                <Col lg={8} md={8}>
                                    <RegistrationView />
                                </Col>
                            )
                        }} />

                        <Route path="/movies/:movieId" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>

                            return <Col md={8}>
                                <MovieView user={this.state?.fullUser} movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path="/directors/:name" render={({ match, history }) => {

                            if (!user) return <Col><LoginView onLoggedIn={user => this.onLoggedIn(user)} /></Col>

                            return (
                                <Col md={8} >
                                    <DirectorView director={movies.find(m => m.Director.Name === match.params.name)?.Director} onBackClick={() => history.goBack()} />
                                </Col>
                            )
                        }} />

                        <Route path="/genres/:name" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            return <Col md={8}>
                                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name)?.Genre} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path={`/users/${user}`} render={({ history }) => {
                            return <Col>
                                <ProfileView movies={movies} user={user} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                    </Row>
                </Container>
            </Router>
        );
    }
}

let mapStateToProps = state => {
    return {
        movies: state.movies,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: (user) => {
            dispatch(setUser(user))
        },
        setMovies: (movies) => {
            dispatch(setMovies(movies))
        }
    }
}

// Redux
// Create Store
// Connect component to the store so that it maps state to props
// You no longer use setState to manipulate state
// Instead you use Reducers and Actions to manipulate it
// Actions are just types (pure functions)
// Reducers is afunctions that takes current state and update it the store then returns new state basedon Action

export default connect(mapStateToProps, mapDispatchToProps)(MainView);