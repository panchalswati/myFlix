import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap/';
import { setMovies } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';

import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { Navbar } from '../navbar/navbar';
import { ProfileView } from '../profile-view/profile-view';
import { RegistrationView } from '../registration-view/registration-view';

import './main-view.scss';

class MainView extends React.Component {

    constructor() {
        super();
        this.state = {
            user: null
        };
    }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                user: localStorage.getItem('user')
            });
            this.getMovies(accessToken);
        }
    }

    getMovies(token) {
        axios.get('https://myflix-movies-heroku.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                // assign the result to the state
                this.props.setMovies(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // When a user successfully logs in, this function updates the 'user' property in state to that particular user
    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username
        });
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
            user: null
        });
    }

    /*onRegisterIn(user) {
        console.log(user);
        this.setState({
            user
        });
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', user.Username);
    }*/

    render() {
        const { movies, user } = this.state;

        return (
            <Router>
                <Navbar user={user} />
                <Row className="main-view justify-content-md-center">
                    <Routes>
                        <Route exact path="/" render={() => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <MoviesList movies={movies} />
                        }} />

                        <Route path="/login" element={<LoginView onLoggedIn={users => this.onLoggedIn(users)} />} render={() => {
                            if (user) return <Redirect to="/" />
                            return <Col md={8}>
                                <LoginView />
                            </Col>
                        }} />

                        <Route path="/register" element={<RegistrationView />} render={() => {
                            if (user) return <Redirect to="/" />
                            return <Col>
                                <RegistrationView />
                            </Col>
                        }} />

                        <Route path="/movies/:movieId" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <Col md={8}>
                                <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path="/directors/:name" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <Col md={8}>
                                <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path="/genres/:name" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <Col md={8}>
                                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path={`/users/${user}`} render={({ history }) => {
                            if (!user) return <Redirect to="/" />
                            return <Col>
                                <ProfileView user={user} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />
                        <Route path='/users/:username' render={({ history, match }) => {
                            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            if (movies.length === 0) return <div className="main-view" />
                            return
                            <ProfileView history={history} movies={movies} user={user === match.params.username} />
                        }} />
                    </Routes>
                </Row>
            </Router>
        );
    }
}

let mapStateToProps = state => {
    return { movies: state.movies }
}


export default connect(mapStateToProps, { setMovies })(MainView);