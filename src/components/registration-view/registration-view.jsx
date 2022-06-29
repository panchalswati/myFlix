import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function RegistrationView(props) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [Birthdate, setBirthdate] = useState('');
    const [favoriteMovies, setFavoriteMovies] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        console.log(name, password);
        props.onRegisterIn(name);

        return (
            <form>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Birthdate:
                    <input type="Birthdate" value={Birthdate} onChange={e => setBirthdate(e.target.value)} />
                </label>
                <label>
                    FavoriteMovies:
                    <input type="favoriteMovies" value={favoriteMovies} onChange={e => setfavoriteMovies(e.target.value)} />
                </label>
                <button type="submit" onClick={handleRegister}>Register</button>
            </form>
        );
    }
}


