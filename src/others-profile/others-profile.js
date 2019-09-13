import React from "react";
import axios from "../app/axios";
import FriendButton from "./friend-button";

export default class OthersProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        try {
            const { id } = this.props.match.params;
            const { data } = await axios.get("/api/users/profile/" + id);
            if (data.otherData.onUserProfile) {
                this.props.history.push("/");
            } else {
                this.setState(data.otherData);
            }
        } catch (error) {
            console.log(
                "error inside other-profile.js in componentDidMount: ",
                error
            );
        }
    }
    render() {
        return (
            <div>
                <div>
                    <img
                        className="profile-image"
                        src={this.state.image || "/ninja.png"}
                    />
                    <FriendButton recipientId={this.props.match.params.id} />
                </div>
                <div>
                    <h2>
                        Profile of {this.state.forename} {this.state.surname}
                    </h2>
                </div>

                {this.state.biography && (
                    <div>
                        <h3>Biography:</h3>
                        <p>{this.state.biography}</p>
                    </div>
                )}
                {!this.state.biography && (
                    <div>
                        <h3>Biography:</h3>
                        <p>No biography</p>
                    </div>
                )}
            </div>
        );
    }
}
