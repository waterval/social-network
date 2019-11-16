import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsAndRequesters,
    acceptFriend,
    removeFriendOrRequester
} from "./friends-actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const requesters = useSelector(
        state =>
            state.users &&
            state.users.filter(user => user.friend_request_accepted == false)
    );
    const friends = useSelector(
        state =>
            state.users &&
            state.users.filter(user => user.friend_request_accepted == true)
    );
    useEffect(() => {
        dispatch(getFriendsAndRequesters());
    }, []);
    if (!requesters && !friends) {
        return <p>Page loading...</p>;
    }
    return (
        <div>
            <h1>Friends</h1>
            <h2>Friend requests:</h2>
            <div className="friends-all-container">
                {requesters &&
                    requesters.map(user => (
                        <div key={user.id} className="friend-one-container">
                            <Link to={`/users/${user.id}`}>
                                <img
                                    src={user.image || "/ninja.png"}
                                    className="profile-image"
                                />
                                <p>
                                    {user.forename} {user.surname}
                                </p>
                            </Link>
                            <button
                                onClick={e => dispatch(acceptFriend(user.id))}
                            >
                                Accept friend
                            </button>
                            <button
                                onClick={e =>
                                    dispatch(removeFriendOrRequester(user.id))
                                }
                            >
                                Decline friend
                            </button>
                        </div>
                    ))}
            </div>
            {!requesters.length === 0 && (
                <div>
                    <p>Currently there are no friend requests.</p>
                </div>
            )}
            {friends && (
                <div>
                    <h2>Your friends:</h2>
                    <div className="friends-all-container">
                        {friends.map(user => (
                            <div key={user.id} className="friend-one-container">
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={user.image || "/ninja.png"}
                                        className="profile-image"
                                    />
                                    <p>
                                        {user.forename} {user.surname}
                                    </p>
                                </Link>
                                <button
                                    onClick={e =>
                                        dispatch(
                                            removeFriendOrRequester(user.id)
                                        )
                                    }
                                >
                                    Remove friend
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
