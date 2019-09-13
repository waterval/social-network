import React, { useEffect, useRef } from "react";
import { socket } from "../app/socket";
import { useSelector } from "react-redux";

export default function Chatroom() {
    const latestChatMessages = useSelector(
        state => state && state.latestChatMessages
    );

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [latestChatMessages]);

    if (!latestChatMessages && !elemRef) {
        return <p>Page loading...</p>;
    }

    const keyCheck = event => {
        if (event.target.value.length === 0 && event.key === "Enter") {
            event.preventDefault();
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            socket.emit("Add New Message", event.target.value);
            event.target.value = "";
        }
    };

    const mouseClick = event => {
        if (event.target.form.textarea.value.length === 0) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        socket.emit("Add New Message", event.target.form.textarea.value);
        event.target.form.textarea.value = "";
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <div className="chatroom-container" ref={elemRef}>
                {latestChatMessages &&
                    latestChatMessages.map(message => (
                        <div
                            key={message.id}
                            className="chatroom-message-container"
                        >
                            <div>
                                <img
                                    className="chatroom-image"
                                    src={message.image || "/ninja.png"}
                                    alt={`${message.forename} ${message.surname}`}
                                />
                            </div>
                            <div className="chatroom-text-container">
                                <p>
                                    <strong>
                                        {message.forename} {message.surname} {}
                                    </strong>
                                    on {message.date}:
                                </p>
                                <p>{message.message}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <form>
                <textarea
                    name="textarea"
                    className="chatroom-textarea"
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                ></textarea>
                <button onClick={mouseClick}>Add message</button>
            </form>
        </div>
    );
}
