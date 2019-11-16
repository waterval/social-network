import React, { useState, useEffect } from "react";
import axios from "../app/axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [userList, setUserList] = useState([]);
    const [searchQuery, setSearchQuery] = useState();

    useEffect(() => {
        let ignore = false;
        (async () => {
            const { data } = await axios.get(`/api/users/find/` + searchQuery);
            if (!ignore) {
                setUserList(data.data);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [searchQuery]);

    return (
        <div>
            <h1>Community</h1>
            <h2>Find a person:</h2>
            <input
                name="userInput"
                onChange={event => setSearchQuery(event.target.value)}
                defaultValue={searchQuery}
            />
            {!searchQuery && userList && (
                <div>
                    <h2>
                        Take a look at the 3 newest members of our community:
                    </h2>
                    <div className="community-all-container">
                        {userList.map(user => (
                            <div
                                key={user.id}
                                className="community-one-container"
                            >
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={user.image || "/ninja.png"}
                                        className="profile-image"
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = "/ninja.png";
                                        }}
                                    />
                                    <p>
                                        {user.forename} {user.surname}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {searchQuery && userList && userList.length > 0 && (
                <div>
                    <h2>
                        Take a look at members that are found based on the
                        search query:
                    </h2>
                    <div className="community-all-container">
                        {userList.map(user => (
                            <div
                                key={user.id}
                                className="community-one-container"
                            >
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={user.image || "/ninja.png"}
                                        className="profile-image"
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = "/ninja.png";
                                        }}
                                    />
                                    <p>
                                        {user.forename} {user.surname}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {(!userList || userList.length == 0) && (
                <div>
                    <h2>
                        There are no members found based on the search query.
                        Please try again.
                    </h2>
                </div>
            )}
        </div>
    );
}
