import axios from "../app/axios";

export async function getFriendsAndRequesters() {
    const { data } = await axios.get("/api/friends/requests");
    return {
        type: "GET_FRIENDS_AND_REQUESTERS",
        users: data.users
    };
}

export async function removeFriendOrRequester(id) {
    const { data } = await axios.post(
        `/api/friends/remove-friend-requester/${id}`
    );
    return {
        type: "REMOVE_FRIEND_OR_REQUESTER",
        id
    };
}

export async function acceptFriend(id) {
    const { data } = await axios.post(`/api/friends/accept-friend/${id}`);
    return {
        type: "ACCEPT_FRIEND",
        id
    };
}
