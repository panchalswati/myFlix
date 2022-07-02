import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';

export function Navbar() {
    let user = localStorage.getItem("user");

    const handleLogOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        window.open("/", "_self");
        props.onLoggedOut(user);
    };

    const isAuth = () => {
        if (typeof window == "undefined") {
            return false;
        }
        if (localStorage.getItem("token")) {
            return localStorage.getItem("token");
        } else {
            return false;
        }
    };

    return (

        <Navbar className="main-nav" sticky="top" bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">MyFlix</Navbar.Brand>

                <Nav className="ml-auto">
                    {isAuth() && (
                        <Nav.Link href={`/users/${users}`}>{users}</Nav.Link>
                    )}
                    {isAuth() && (
                        <Button variant="link" onClick={handleLogOut}>Logout</Button>
                    )}
                    {!isAuth() && (
                        <Nav.Link href="/login">Login</Nav.Link>
                    )}
                    {!isAuth() && (
                        <Nav.Link href="/register">Register</Nav.Link>
                    )}
                </Nav>

            </Container>
        </Navbar>

    )
}
