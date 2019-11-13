import axios from "../app/axios";

export async function getBirthdays() {
    const { data } = await axios.get("/api/birthdays");
    return {
        type: "GET_BIRTHDAYS",
        users: data.users
    };
}
