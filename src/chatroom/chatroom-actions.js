export async function latestChatMessages(data) {
    return {
        type: "GET_LATEST_MESSAGES",
        latestChatMessages: data
    };
}

export async function chatMessageSuccess(latestMessage) {
    return {
        type: "ADDED_CHAT_MESSAGE",
        latestMessage
    };
}
