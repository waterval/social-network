import React from "react";
import axios from "../app/axios";

export default class AddBirthday extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userInput = this.userInput.bind(this);
        this.addBirthday = this.addBirthday.bind(this);
    }
    userInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async addBirthday(event) {
        event.preventDefault();
        try {
            await axios.post("/add-birthday", {
                birthdayDay: this.state.birthdayDay,
                birthdayMonth: this.state.birthdayMonth,
                birthdayYear: this.state.birthdayYear
            });
            this.props.updateBirthdayDay(this.state.birthdayDay);
            this.props.updateBirthdayMonth(this.state.birthdayMonth);
            this.props.updateBirthdayYear(this.state.birthdayYear);
        } catch (error) {
            console.log(
                "error inside add-birthday.js in async addBirthday: ",
                error
            );
        }
    }
    render() {
        return (
            <div>
                <label>
                    Day:
                    <input name="birthdayDay" onChange={this.userInput} />
                </label>
                <label>
                    Month:
                    <input name="birthdayMonth" onChange={this.userInput} />
                </label>
                <label>
                    Year:
                    <input name="birthdayYear" onChange={this.userInput} />
                </label>
                {!this.props.birthdayDay &&
                    !this.props.birthdayMonth &&
                    !this.props.birthdayYear && (
                    <button onClick={this.addBirthday}>Add birthday</button>
                )}
                {(this.props.birthdayDay ||
                    this.props.birthdayMonth ||
                    this.props.birthdayYear) && (
                    <button onClick={this.addBirthday}>Edit birthday</button>
                )}
            </div>
        );
    }
}
