import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';

import ToastMessage from '../components/ToastMessage';


import logo from '../asset/text_logo.png'
import './Login.css'

class Login extends Component {
    state = {
        email: "",
        password: "",
        loginSucess: false,
        toastMessage: "",
        open: false
    }
    componentDidMount = () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            this.props.history.push('/');
        }
    }
    handleClick = () => {
        this.setState({ open: true });
    };
    
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });
    };
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleLogin = async () => {
        const { email, password } = this.state;
        const res = await fetch(`http://api.gamepicker.co.kr/auth/login?admin`, {
            headers: {
                'authorization': 'w6mgLXNHbPgewJtRESxh',
                'content-type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({
                email, password
            })
        });
        const json = await res.json();
        if (res.ok) {
            sessionStorage.setItem('token', json.token);            
            this.setState({ open: true, toastMessage: 'Login success' });
            this.props.history.push('/')
        } else {
            this.setState({ open: true, toastMessage: 'Login failed' });
        }
    }
    render() {
        const { loginSucess } = this.state;
        if (loginSucess) {
            return <Redirect to='/'></Redirect>
        } else {
            return (
                <section className='login'>
                    <form>
                        <legend>
                            <img src={logo} alt='text logo'></img>
                        </legend>
                        <TextField
                            id="outlined-email-input"
                            label="Email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleChange}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleChange}
                        />
                        <Button variant="contained" color="primary" onClick={this.handleLogin}>Login</Button>
                    </form>        
                    <ToastMessage
                        message={this.state.toastMessage}
                        open={this.state.open}
                        handleClose={this.handleClose}
                    />
                </section>
            )
        }
    }
}

export default Login;