import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Button, Col, Container, Row } from 'react-bootstrap';

import { FavoriteMoviesView } from './favorite-movie-view';
import { UpdateView } from './update-view';

import './profile-view.scss';

export function ProfileView(props) {
    const [users, setUser] = useState(props.users);
    const [movies, setMovies] = useState(props.movies);
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const currentUser = localStorage.getItem('users');
    const token = localStorage.getItem('token');

    const getUser = () => {
        axios.get(`https://myflix-movies-heroku.herokuapp.com/users/${currentUser}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUser(response.data);
                setFavouriteMovies(response.data.FavouriteMovies)
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        getUser();
    }, [])

    const handleDelete = () => {
        axios.delete(`https://myflix-movies-heroku.herokuapp.com/users/${currentUser}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert(`The account ${users.Username} was successfully deleted.`)
                localStorage.clear();
                window.open('/register', '_self');
            }).
            catch(error => console.error(error))
    }

    return (
        <Container id="profile-form">
            <Row><h4>Your profile</h4></Row>
            <Row>
                <Col className="label">Username:</Col>
                <Col className="value">{users.Username}</Col>
            </Row>
            <Row className="mt-3">
                <Col className="label">Password:</Col>
                <Col className="value">******</Col>
            </Row>
            <Row className="mt-3">
                <Col className="label">Email:</Col>
                <Col className="value">{users.Email}</Col>
            </Row>
            <Row className="mt-3">
                <Col className="label">Birthdate:</Col>
                <Col className="value">{users.Birthdate}</Col>
            </Row>
            <Row className="mt-5"><h4>Your favorite movies</h4></Row>
            <Row className="mt-3">
                <FavoriteMoviesView
                    movies={movies}
                    favouriteMovies={FavoriteMovies}
                    currentUser={currentUser}
                    token={token} />
            </Row>
            <UpdateView users={users} />
            <Button className="d-block mt-5" variant="warning" onClick={handleDelete}>Delete profile</Button>
        </Container>
    )
}