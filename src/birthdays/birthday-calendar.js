import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBirthdays } from "./birthday-actions";
import BirthdayMonth from "./birthday-month";

export default function BirthdayCalendar() {
    const dispatch = useDispatch();
    const birthdays = useSelector(
        state =>
            state.birthdays &&
            state.birthdays.filter(birthday => birthday.birthday_month)
    );
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    useEffect(() => {
        dispatch(getBirthdays());
    }, []);
    if (!birthdays) {
        return <p>Page loading...</p>;
    }

    return (
        <div>
            <h1>Birthday Calendar</h1>
            {birthdays &&
                months.map(month => (
                    <BirthdayMonth
                        key={month}
                        monthIndex={month}
                        month={birthdays
                            .filter(months => month == months.birthday_month)
                            .sort((a, b) => a.birthday_day - b.birthday_day)}
                    />
                ))}
        </div>
    );
}
