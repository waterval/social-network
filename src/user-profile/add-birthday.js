import React from "react";
import axios from "../app/axios";

export default class AddBirthday extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userInput = this.userInput.bind(this);
        this.addBirthday = this.addBirthday.bind(this);
        this.optionGenerator = this.optionGenerator.bind(this);
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
            this.setState({ editBirthday: false });
        } catch (error) {
            console.log(
                "error inside add-birthday.js in async addBirthday: ",
                error
            );
        }
    }
    optionGenerator(startingNumber, endingNumber) {
        let options = [];
        for (let i = startingNumber; i < endingNumber; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return options;
    }
    render() {
        let dayOptions = this.optionGenerator(1, 32);
        let monthOptions = this.optionGenerator(1, 13);
        let yearOptions = this.optionGenerator(1899, 2020);
        yearOptions.reverse();
        let birthdayButtonText;
        if (
            this.props.birthdayDay ||
            this.props.birthdayMonth ||
            this.props.birthdayYear
        ) {
            birthdayButtonText = "Edit birthday";
        } else {
            birthdayButtonText = "Add birthday";
        }
        return (
            <div>
                {this.state.editBirthday && (
                    <div>
                        <label>
                            Day:
                            <select
                                id="birthdayDay"
                                name="birthdayDay"
                                onChange={this.userInput}
                            >
                                <option key="0" value="">
                                    -
                                </option>
                                {dayOptions}
                            </select>
                        </label>
                        <label>
                            Month:
                            <select
                                id="birthdayMonth"
                                name="birthdayMonth"
                                type="number"
                                onChange={this.userInput}
                            >
                                <option key="0" value="">
                                    -
                                </option>
                                {monthOptions}
                            </select>
                        </label>
                        <label>
                            Year:
                            <select
                                id="birthdayYear"
                                name="birthdayYear"
                                type="number"
                                onChange={this.userInput}
                            >
                                <option key="0" value="">
                                    -
                                </option>
                                {yearOptions}
                            </select>
                        </label>
                        <button onClick={this.addBirthday}>Add birthday</button>
                    </div>
                )}
                {!this.state.editBirthday && (
                    <div>
                        <button
                            onClick={event =>
                                this.setState({ editBirthday: true })
                            }
                        >
                            {birthdayButtonText}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
