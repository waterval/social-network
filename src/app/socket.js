import * as io from "socket.io-client";
import {
    latestChatMessages,
    chatMessageSuccess
} from "../chatroom/chatroom-actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("Get Latest Chat Messages", data => {
            store.dispatch(latestChatMessages(data));
        });

        socket.on("New Chat Message Added", latestMessage => {
            store.dispatch(chatMessageSuccess(latestMessage));
        });
    }
};
