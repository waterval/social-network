import React from "react";
import axios from "../app/axios";

export default class BiographyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userInput = this.userInput.bind(this);
        this.addBiography = this.addBiography.bind(this);
    }
    userInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async addBiography(event) {
        event.preventDefault();
        try {
            const results = await axios.post("/add-biography", {
                biography: this.state.newBiography
            });
            this.props.updateBiography(results.data.biography);
            this.setState({ editBiography: false });
        } catch (error) {
            console.log(
                "error inside biography-editor.js in async addBiography: ",
                error
            );
        }
    }
    render() {
        return (
            <div>
                {this.state.editBiography && (
                    <div>
                        <div>
                            <textarea
                                onChange={this.userInput}
                                name="newBiography"
                            />
                        </div>
                        <div>
                            <button onClick={this.addBiography}>
                                Save biography
                            </button>
                        </div>
                    </div>
                )}
                <div>
                    {!this.props.biographyText && !this.state.editBiography && (
                        <button
                            onClick={event =>
                                this.setState({ editBiography: true })
                            }
                        >
                            Add biography
                        </button>
                    )}
                    {this.props.biographyText && !this.state.editBiography && (
                        <button
                            onClick={event =>
                                this.setState({ editBiography: true })
                            }
                        >
                            Edit biography
                        </button>
                    )}
                </div>
            </div>
        );
    }
}
