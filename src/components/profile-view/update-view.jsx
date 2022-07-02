import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import './profile-view.scss';

export function UpdateView(props) {
    const { users } = props;
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [Birthdate, setBirthdate] = useState('');
    const [values, setValues] = useState({
        UsernameErr: '',
        PasswordErr: '',
        EmailErr: '',
    });

    // validate user inputs
    const validate = () => {
        let isReq = true;
        if (!Username) {
            setValues({ ...values, UsernameErr: 'Username required' });
            isReq = false;
        } else if (Username.length < 2) {
            setValues({ ...values, UsernameErr: 'Username must be at least 2 characters long' });
            isReq = false;
        }
        if (!Password) {
            setValues({ ...values, PasswordErr: 'Password required' });
            isReq = false;
        } else if (Password.length < 6) {
            setValues({ ...values, PasswordErr: 'Password must be at least 6 characters long' });
            isReq = false;
        }
        if (!Email) {
            setValues({ ...values, EmailErr: 'Email required' });
            isReq = false;
        } else if (Email.indexOf('@') === -1) {
            setValues({ ...values, EmailErr: 'Enter valid email' });
            isReq = false;
        }
        return isReq;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isReq = validate();
        if (isReq) {
            const token = localStorage.getItem('token');
            axios.put(`https://myflix-movies-heroku.herokuapp.com/users/${users.Username}`, {
                Username: Username,
                Password: Password,
                Email: Email,
                Birthdate: Birthdate
            },
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    alert('Profile was successfully updated.');
                    window.open('/users/:username', '_self');
                })
                .catch(error => {
                    console.error(error);
                    alert('Unable to update profile.');
                });
        }
    };

    return (
        <Container id="update-form" className="mt-5">
            <Row><h4>Edit profile</h4></Row>
            <Row>
                <Col sm="10" md="8" lg="6">
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control type="text" value={Username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                            {/* display validation error */}
                            {values.UsernameErr && <p>{values.UsernameErr}</p>}
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" value={Password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                            {/* display validation error */}
                            {values.PasswordErr && <p>{values.PasswordErr}</p>}
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="text" value={Email} onChange={e => setEmail(e.target.value)} placeholder="your@mail.com" required />
                            {/* display validation error */}
                            {values.EmailErr && <p>{values.EmailErr}</p>}
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthdate:</Form.Label>
                            <Form.Control type="text" value={Birthdate} onChange={e => setBirthdate(e.target.value)} placeholder="YYYY-MM-DD" />
                        </Form.Group>
                        <Form.Group controlId="formBirthdate" className="mt-3">
                            <Button variant="warning" type="submit" onClick={handleSubmit}>Edit profile</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}