import React from "react";
import axios from "../app/axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadMessage: false
        };
        this.uploadImage = this.uploadImage.bind(this);
    }
    async uploadImage(event) {
        const { updateImage, hideUploadOption } = this.props;
        this.setState({ uploadMessage: true });
        try {
            const userImage = await event.target.files[0];
            let formData = new FormData();
            formData.append("file", userImage);
            const results = await axios.post("/upload-image", formData);
            updateImage(results.data.image);
            hideUploadOption();
        } catch (error) {
            console.log(
                "error inside uploader.js in async uploadImage: ",
                error
            );
        }
    }
    render() {
        return (
            <div className="uploader-container">
                <div
                    onClick={this.props.hideUploadOption}
                    className="uploader-closer"
                >
                    <p>X</p>
                </div>
                <p className="uploader-copy">
                    Would you like to change your profile image?
                </p>
                <input
                    onChange={this.uploadImage}
                    name="file"
                    type="file"
                    accept="image/*"
                    className="uploader-input"
                />
                {this.state.uploadMessage && <p>Image is being uploaded...</p>}
            </div>
        );
    }
}
