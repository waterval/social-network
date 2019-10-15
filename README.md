# Social Network

Social Network is a platform for users that want to connect with each other. Access to this platform is only granted with an account that can be created for free. A user can upload their profile picture, write a biography and add their birthday. On the platform they can find other users, make friends and chat with everyone at the same time. Also a birthday calendar featuring all users are visible to the community.

## Preview

<p align="center">
<img src="/public/social-network-preview.png" alt="Preview of Social Network">
</p>

## Features

-   User authentication page: register and login to an account
-   User profile page: upload a profile image, add biography and add birthday
-   Others’ profile page: send, accept or reject a friend request and view profile information
-   Community page: use a search query to find anyone in the community and jump to their profile
-   Friends page: accept or decline friend requests, view all friends and have the ability to end friendships
-   Chatroom page: communicate in real-time via text messages with the entire community
-   Birthday calendar page: view all birthdays automatically sorted by month and by day

## Technology

-   HTML
-   CSS
-   JavaScript
-   React
-   Hooks
-   Redux
-   Node
-   Express
-   Sockets
-   AWS S3
-   Jest
-   Postgres

## Code Example

```
export default function BirthdayCalendar() {
    (...)
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
```

```
export default function BirthdayMonth({ month, monthIndex }) {
    (...)
    return (
        <div className="birthday-container">
            <h2>{monthNames[monthIndex]}:</h2>
            {month &&
                month.map(user => (
                    <div key={user.id} className="birthday-image-container">
                        <a href={"/users/" + user.id}>
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
                        </a>
                        <div className="birthday-image-text">
                            {user.birthday_day}
                        </div>
                    </div>
                ))}
        </div>
    );
}
```

## Credits

The idea for this project was inspired by David Friedman of Spiced Academy.

## Contribute

Contribution is much appreciated. Please let me know about any bugs and ideas for improvements.
