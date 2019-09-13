import React, { useState, useEffect } from "react";
import axios from "../app/axios";

export default function FriendButton(props) {
    const [friendRelation, setFriendRelation] = useState();
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        let ignore = false;
        (async () => {
            const recipientId = props.recipientId;
            if (friendRelation) {
                const tableUpdated = await axios.post(
                    `/api/users/friendship-status/${recipientId}/${buttonText}`
                );
            }
            const { data } = await axios.get(
                `/api/users/friendship-status/${recipientId}`
            );
            if (!ignore) {
                setButtonText(data.friendButtonText);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [friendRelation]);

    return (
        <div>
            <button
                name="friendRequest"
                onClick={e => setFriendRelation({ buttonText })}
            >
                {buttonText}
            </button>
        </div>
    );
}
