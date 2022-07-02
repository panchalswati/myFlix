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
            users: null
        };
    }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                users: localStorage.getItem('users')
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
            users: authData.users.Username
        });
        localStorage.setItem('token', authData.token);
        localStorage.setItem('users', authData.users.Username);
        this.getMovies(authData.token);
    }

    onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('users');
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
        const { movies } = this.props;
        const { users } = this.state;
        return (
            <Router>
                <Navbar users={users} />
                <Row className="main-view justify-content-md-center">
                    <Routes>
                        <Route exact path="/" element={<LoginView onLoggedIn={users => this.onLoggedIn(users)} />} ss render={() => {
                            if (!users) return <Col>
                                <LoginView onLoggedIn={users => this.onLoggedIn(users)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <MoviesList movies={movies} />
                        }} />

                        <Route path="/login" element={<LoginView onLoggedIn={users => this.onLoggedIn(users)} />} render={() => {
                            if (users) return <Redirect to="/" />
                            return <Col md={8}>
                                <LoginView />
                            </Col>
                        }} />

                        <Route path="/register" element={<RegistrationView />} render={() => {
                            if (users) return <Redirect to="/" />
                            return <Col md={8}>
                                <RegistrationView />
                            </Col>
                        }} />

                        <Route path="/movies/:movieId" render={({ match, history }) => {
                            if (!users) return <Col>
                                <LoginView onLoggedIn={users => this.onLoggedIn(users)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <Col md={8}>
                                <MovieView movies={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path="/directors/:name" render={({ match, history }) => {
                            if (!users) return <Col>
                                <LoginView onLoggedIn={users => this.onLoggedIn(users)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <Col md={8}>
                                <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path="/genres/:name" render={({ match, history }) => {
                            if (!users) return <Col>
                                <LoginView onLoggedIn={users => this.onLoggedIn(users)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <Col md={8}>
                                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />

                        <Route path="/users/:username" render={({ match, history }) => {
                            if (!users) return <Col>
                                <LoginView onLoggedIn={users => this.onLoggedIn(users)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            if (!users) return <Redirect to="/" />
                            return <Col md={8}>
                                <ProfileView movies={movies} users={users === match.params.Username} onBackClick={() => history.goBack()} />
                            </Col>
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