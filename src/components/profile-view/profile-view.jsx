import React from 'react';
import { Button, Card, Container, Row, Col, FormControl, FormGroup, Form } from 'react-bootstrap';
import axios from 'axios';
import { remFavMovie } from '../../actions/actions';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import "./profile-view.scss";

class ProfileView extends React.Component {
    constructor() {
        super();

        this.state = {
            Username: '',
            Password: '',
            Email: '',
            Birthdate: '',
            FavoriteMovies: []
        };
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('token');
        this.getUser(accessToken);
    }

    getUser(token) {
        const user = localStorage.getItem('user');
        axios.get(`https://myflix-movies-heroku.herokuapp.com/users/${user}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                this.setState({
                    Username: response.data.Username,
                    Password: response.data.Password,
                    Email: response.data.Email,
                    Birthdate: response.data.Birthdate,
                    FavoriteMovies: response.data.FavouriteMovies
                });
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    //Sends a PUT request to API and the response sets the state to update user info.

    updateUser = (e) => {
        e.preventDefault();
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios.put(`https://myflix-movies-heroku.herokuapp.com/users/${user}`,
            {
                Username: this.state.Username,
                Password: this.state.Password,
                Email: this.state.Email,
                Birthdate: this.state.Birthdate

            }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                this.setState({
                    Username: response.data.Username,
                    Password: response.data.Password,
                    Email: response.data.Email,
                    Birthdate: response.data.Birthdate
                });

                localStorage.setItem('user', this.state.Username);
                alert("Profile has been updated!");
            });
    }

    //Sends a DELETE request to API and console.log message indicates success
    removeFromFavorite = (event, movie) => {
        event.preventDefault()

        console.log('removing from favorites: ', movie, this.props.user)

        const username = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        console.log('remove fav auth: ', token)

        axios
            .delete(
                `https://myflix-movies-heroku.herokuapp.com/users/${username}/movies/${movie._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            .then((res) => {
                this.setState({ FavoriteMovies: res?.data?.FavoriteMovies });
                this.props.remFavMovie(res?.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    //Sends DELETE request to API and console.log message indicates success
    removeUser() {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        axios.delete(`https://myflix-movies-heroku.herokuapp.com/users/${user}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                console.log(response.data);
                alert("Profile has been deleted");
                localStorage.removeItem('user');
                localStorage.removeItem('token');

                window.open("/", "_self");
            })
            .catch(e => {
                console.log(e);
            });
    }

    setUsername(value) {
        this.setState({
            Username: value
        });
    }

    setEmail(value) {
        this.setState({
            Email: value
        });
    }

    setBirthdate(value) {
        this.setState({
            Birthdate: value
        });
    }

    render() {
        const { movies } = this.props;
        const { FavoriteMovies, Username, Email, Birthdate } = this.state;

        return (
            <Container className="form-element">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body className="bg-col lining">
                                <Card.Title>My Account</Card.Title>
                                <Form
                                    onSubmit={(e) => {
                                        this.updateUser(e)
                                    }} >
                                    <FormGroup className="mb-3" controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <FormControl
                                            type="text"
                                            name="username"
                                            placeholder="username"
                                            value={Username}
                                            onChange={(e) => this.setUsername(e.target.value || '')}
                                            required />
                                    </FormGroup>

                                    <FormGroup className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <FormControl
                                            type="email"
                                            name="email"
                                            placeholder="Enter a new email"
                                            value={Email}
                                            onChange={(e) => this.setEmail(e.target.value)}
                                            required />
                                    </FormGroup>
                                    <FormGroup className="mb-3" controlId="birthdate">
                                        <Form.Label>Birthdate</Form.Label>
                                        <FormControl
                                            type="Date"
                                            name="Birthdate"
                                            placeholder="dd-mm-yyyy"
                                            value={Birthdate}
                                            onChange={(e) => this.setBirthdate(e.target.value || '')}
                                            required />
                                    </FormGroup>

                                    <br></br>

                                    <Button
                                        id="update-user-button"
                                        className="button"
                                        variant="primary"
                                        type="submit"
                                        onClick={this.updateUser}>
                                        Update
                                    </Button>

                                    <Button
                                        id="delete-profile-button"
                                        className="button"
                                        variant="secondary"
                                        onClick={() => this.removeUser()}>
                                        Delete Profile
                                    </Button>
                                </Form>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="Fav-movies">
                    <Card.Body className="bg-col lining">
                        <Card.Title>My Favorite Movies</Card.Title>
                        {!FavoriteMovies || FavoriteMovies.length === 0 && (
                            <div>Favorites list is empty.</div>
                        )}
                        <Row>
                            {FavoriteMovies?.length > 0 && movies.map((movie) => {
                                if (movie._id === FavoriteMovies.find((fav) => fav === movie._id)) {
                                    return (
                                        <Card key={movie._id} className=" col-md-3 card-fav-movie">
                                            <Link to={`/movies/${movie._id}`} className="text-link">
                                                <Card.Img
                                                    className="fav-movie"
                                                    variant="top"
                                                    src={movie.ImagePath}
                                                    crossOrigin="anonymous"
                                                /></Link>
                                            <Card.Body>
                                                <div className="div-button-rem-favs">
                                                    <Button
                                                        className="button-rem-favs"
                                                        value={movie._id}
                                                        onClick={(e) => this.removeFromFavorite(e, movie)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                }
                            })}
                        </Row>
                    </Card.Body>
                </Card>

            </Container>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { remFavMovie })(ProfileView);

