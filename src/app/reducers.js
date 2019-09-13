export default function(state = {}, action) {
    if (action.type == "GET_FRIENDS_AND_REQUESTERS") {
        state = {
            ...state,
            users: action.users
        };
    }
    if (action.type == "REMOVE_FRIEND_OR_REQUESTER") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    friend_request_accepted: null
                };
            })
        };
    }
    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    friend_request_accepted: true
                };
            })
        };
    }
    if (action.type == "DECLINE_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    friend_request_accepted: null
                };
            })
        };
    }

    if (action.type == "GET_LATEST_MESSAGES") {
        state = {
            ...state,
            latestChatMessages: action.latestChatMessages
        };
    }
    if (action.type == "ADDED_CHAT_MESSAGE") {
        return {
            ...state,
            latestChatMessages: [
                ...state.latestChatMessages,
                action.latestMessage
            ]
        };
    }
    if (action.type == "GET_BIRTHDAYS") {
        state = {
            ...state,
            birthdays: action.users
        };
    }
    return state;
}
