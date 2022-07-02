import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { Button, Col, Container, Form, Row } from 'react-bootstrap/';

import './login-view.scss';

export function LoginView(props) {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [UsernameErr, setUsernameErr] = useState('');
    const [PasswordErr, setPasswordErr] = useState('');

    // validate user inputs
    const validate = () => {
        let isReq = true;
        if (!Username) {
            setUsernameErr('Username required');
            isReq = false;
        } else if (Username.length < 2) {
            setUsernameErr('Username must be at least 2 characters long');
            isReq = false;
        }
        if (!password) {
            setPasswordErr('Password required');
            isReq = false;
        } else if (password.length < 6) {
            setPasswordErr('Password must be at least 6 characters long');
            isReq = false;
        }
        return isReq;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isReq = validate();
        if (isReq) {
            // Send a request to the server for authentication
            axios.post('https://myflix-movies-heroku.herokuapp.com/login', {
                Username: Username,
                Password: Password
            })
                .then(response => {
                    const data = response.data;
                    props.onLoggedIn(data);
                })
                .catch(e => {
                    console.log('No such user')
                });
        }
    };

    return (
        <Container id="login-form">
            <Row className="justify-content-center">
                <Col sm="10" md="8" lg="6">
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control type="text" onChange={e => setUsername(e.target.value)} placeholder="Username" />
                            {/* display validation error */}
                            {UsernameErr && <p>{UsernameErr}</p>}
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                            {/* display validation error */}
                            {PasswordErr && <p>{PasswordErr}</p>}
                        </Form.Group>
                        <Row className="mt-3 justify-content-start">
                            <Col sm="10" md="8" lg="6">
                                <Button variant="warning" type="submit" onClick={() => handleSubmit()}>Login</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

LoginView.propTypes = {
    user: PropTypes.shape({
        Username: PropTypes.string.isRequired,
        Password: PropTypes.string.isRequired,
    }),
    onLoggedIn: PropTypes.func.isRequired
}