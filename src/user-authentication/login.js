import React from "react";
import axios from "../app/axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userInput = this.userInput.bind(this);
        this.userLogin = this.userLogin.bind(this);
    }

    userInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    userLogin(event) {
        event.preventDefault();
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.passwordValid) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.error && (
                        <div className="error">
                            Something went wrong. Please try again.
                        </div>
                    )}
                </div>
                <p>Login to the community:</p>
                <div className="welcome-field">
                    <label className="welcome-label">Email:</label>
                    <input
                        name="email"
                        onChange={this.userInput}
                        className="welcome-input"
                    />
                </div>
                <div className="welcome-field">
                    <label className="welcome-label">Password:</label>
                    <input
                        name="password"
                        onChange={this.userInput}
                        className="welcome-input"
                    />
                </div>

                <button onClick={this.userLogin}>Login</button>
                <p>
                    Not an account yet? Please{" "}
                    <Link to="/" className="welcome-link">
                        register
                    </Link>
                    .
                </p>
            </div>
        );
    }
}
