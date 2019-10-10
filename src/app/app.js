import React from "react";
import axios from "./axios";
import { Route, BrowserRouter, NavLink } from "react-router-dom";
import ProfilePicture from "../user-profile/profile-picture.js";
import Uploader from "../user-profile/uploader.js";
import UserProfile from "../user-profile/user-profile.js";
import OthersProfile from "../others-profile/others-profile.js";
import FindPeople from "../community/find-people.js";
import Friends from "../friends/friends.js";
import Chatroom from "../chatroom/chatroom.js";
import BirthdayCalendar from "../birthdays/birthday-calendar.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
    }
    async componentDidMount() {
        const { data } = await axios.get("/user-data");
        this.setState(data.userData);
    }
    render() {
        if (!this.state.id) {
            return (
                <div>
                    Please make sure you are{" "}
                    <a href="/welcome#/login">logged in</a>. Our network is only
                    viewable by members. Not a member yet? Feel free to{" "}
                    <a href="/welcome">register</a>.
                </div>
            );
        }
        return (
            <BrowserRouter>
                <div>
                    <header className="header-container">
                        <img
                            src="/social-network-logo.png"
                            className="header-logo"
                        />
                        <nav>
                            <NavLink
                                exact
                                to="/"
                                className="header-link"
                                activeClassName="active"
                            >
                                Profile
                            </NavLink>
                            <NavLink
                                to="/users/"
                                className="header-link"
                                activeClassName="active"
                            >
                                Community
                            </NavLink>
                            <NavLink
                                to="/friends/"
                                className="header-link"
                                activeClassName="active"
                            >
                                Friends
                            </NavLink>
                            <NavLink
                                to="/chatroom/"
                                className="header-link"
                                activeClassName="active"
                            >
                                Chatroom
                            </NavLink>
                            <NavLink
                                to="/birthdays/"
                                className="header-link"
                                activeClassName="active"
                            >
                                Birthdays
                            </NavLink>
                        </nav>
                        <ProfilePicture
                            displaySize={"50px"}
                            forename={this.state.forename}
                            surname={this.state.surname}
                            image={this.state.image || "/ninja.png"}
                            showUploadOption={() =>
                                this.setState({ uploaderVisible: true })
                            }
                        />
                    </header>
                    <section>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <UserProfile
                                    displaySize={"200px"}
                                    forename={this.state.forename}
                                    surname={this.state.surname}
                                    image={this.state.image || "/ninja.png"}
                                    showUploadOption={() =>
                                        this.setState({ uploaderVisible: true })
                                    }
                                    biographyText={this.state.biography}
                                    updateBiography={biography =>
                                        this.setState({ biography })
                                    }
                                    birthdayDay={this.state.birthdayDay}
                                    birthdayMonth={this.state.birthdayMonth}
                                    birthdayYear={this.state.birthdayYear}
                                    updateBirthdayDay={birthdayDay =>
                                        this.setState({ birthdayDay })
                                    }
                                    updateBirthdayMonth={birthdayMonth =>
                                        this.setState({ birthdayMonth })
                                    }
                                    updateBirthdayYear={birthdayYear =>
                                        this.setState({ birthdayYear })
                                    }
                                />
                            )}
                        />
                        <Route
                            path="/users/:id"
                            render={props => (
                                <OthersProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route exact path="/users" component={FindPeople} />
                        <Route exact path="/friends" component={Friends} />
                        <Route exact path="/chatroom" component={Chatroom} />
                        <Route
                            exact
                            path="/birthdays"
                            component={BirthdayCalendar}
                        />
                    </section>
                    {this.state.uploaderVisible && (
                        <Uploader
                            updateImage={image => this.setState({ image })}
                            hideUploadOption={() =>
                                this.setState({ uploaderVisible: false })
                            }
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
