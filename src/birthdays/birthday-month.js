import React from "react";
import { Link } from "react-router-dom";

export default function BirthdayMonth({ month, monthIndex }) {
    const monthNames = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };

    return (
        <div className="birthday-container">
            <h2>{monthNames[monthIndex]}:</h2>
            {month &&
                month.map(user => (
                    <div key={user.id} className="birthday-image-container">
                        <Link to={`/users/${user.id}`}>
                            <img
                                src={user.image || "/ninja.png"}
                                className="birthday-image"
                                onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = "/ninja.png";
                                }}
                                alt={`${user.forename} ${user.surname}`}
                                title={`${user.forename} ${user.surname} is born on ${user.birthday_day}-${user.birthday_month}-${user.birthday_year}.`}
                            />
                        </Link>
                        <div className="birthday-image-text">
                            {user.birthday_day}
                        </div>
                    </div>
                ))}
        </div>
    );
}
