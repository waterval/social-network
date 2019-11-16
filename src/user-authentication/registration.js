import React from "react";
import axios from "../app/axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userInput = this.userInput.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    userInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    createAccount(event) {
        event.preventDefault();
        axios
            .post("/register", {
                forename: this.state.forename,
                surname: this.state.surname,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                console.log(
                    "data inside createAccount axios post /register.then: ",
                    data
                );
                if (data.registrationValid) {
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
                <p>Feel free to join our community:</p>
                <label className="welcome-label">
                    First name:
                    <input
                        name="forename"
                        onChange={this.userInput}
                        className="welcome-input"
                    />
                </label>
                <label className="welcome-label">
                    Last name:
                    <input
                        name="surname"
                        onChange={this.userInput}
                        className="welcome-input"
                    />
                </label>
                <label className="welcome-label">
                    Email:
                    <input
                        name="email"
                        onChange={this.userInput}
                        className="welcome-input"
                    />
                </label>
                <label className="welcome-label">
                    Password:
                    <input
                        name="password"
                        onChange={this.userInput}
                        className="welcome-input"
                    />
                </label>
                <button onClick={this.createAccount}>
                    Create free account
                </button>
                <p>
                    Already a member? Please{" "}
                    <Link to="/login" className="welcome-link">
                        login
                    </Link>
                    .
                </p>
            </div>
        );
    }
}
