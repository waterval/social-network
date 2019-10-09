const spicedPg = require("spiced-pg");
let database;
if (process.env.DATABASE_URL) {
    database = spicedPg(process.env.DATABASE_URL);
} else {
    database = spicedPg("postgres:postgres:postgres@localhost:5432/network");
}

exports.addUser = (forename, surname, email, password) => {
    return database
        .query(
            `
            INSERT INTO users (forename, surname, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, forename, surname;
            `,
            [forename, surname, email, password]
        )
        .then(({ rows }) => rows[0]);
};

exports.getHashedPassword = email => {
    return database
        .query(
            `
            SELECT *
            FROM users
            WHERE email IN ($1);
            `,
            [email]
        )
        .then(({ rows }) => rows[0]);
};

exports.getUserData = id => {
    return database
        .query(
            `
            SELECT id, forename, surname, image, biography, birthday_day, birthday_month, birthday_year
            FROM users
            WHERE id IN ($1);
            `,
            [id]
        )
        .then(({ rows }) => rows[0]);
};

exports.addUserImage = (id, image) => {
    return database
        .query(
            `
            UPDATE users
            SET image = ($2)
            WHERE id IN ($1)
            returning image;
            `,
            [id, image]
        )
        .then(({ rows }) => rows[0]);
};

exports.addUserBiography = (id, biography) => {
    return database
        .query(
            `
            UPDATE users
            SET biography = ($2)
            WHERE id IN ($1)
            returning biography;
            `,
            [id, biography]
        )
        .then(({ rows }) => rows[0]);
};

exports.addUserBirthday = (id, birthday_day, birthday_month, birthday_year) => {
    return database
        .query(
            `
            UPDATE users
            SET birthday_day = ($2), birthday_month = ($3), birthday_year = ($4)
            WHERE id IN ($1);
            `,
            [id, birthday_day, birthday_month, birthday_year]
        )
        .then(({ rows }) => rows);
};

exports.getNewestUsers = () => {
    return database
        .query(
            `
            SELECT id, forename, surname, image
            FROM users
            ORDER BY id DESC
            LIMIT 3;
            `
        )
        .then(({ rows }) => rows);
};
//
exports.getSearchedUsers = searchQuery => {
    return database
        .query(
            `
            SELECT id, forename, surname, image
            FROM users
            WHERE forename ILIKE $1;
            `,
            [searchQuery + "%"]
        )
        .then(({ rows }) => rows);
};

exports.getFriendshipStatus = (sender_id, recipient_id) => {
    return database
        .query(
            `
            SELECT *
            FROM friendships
            WHERE sender_id = $1 AND recipient_id = $2
            OR sender_id = $2 AND recipient_id = $1;
            `,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => rows[0]);
};

exports.addFriendRequest = (sender_id, recipient_id) => {
    return database
        .query(
            `
            INSERT INTO friendships (sender_id, recipient_id)
            VALUES ($1, $2)
            RETURNING friend_request_accepted;
            `,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => rows);
};

exports.acceptFriendRequest = (sender_id, recipient_id) => {
    return database
        .query(
            `
            UPDATE friendships
            SET friend_request_accepted = true
            WHERE sender_id = $1 AND recipient_id = $2
            OR sender_id = $2 AND recipient_id = $1;
            `,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => rows);
};

exports.deleteFriendOrRequester = (sender_id, recipient_id) => {
    return database
        .query(
            `
            DELETE FROM friendships
            WHERE sender_id = $1 AND recipient_id = $2
            OR sender_id = $2 AND recipient_id = $1;
            `,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => rows);
};

exports.getFriendsAndRequesters = user_id => {
    return database
        .query(
            `
            SELECT users.id, forename, surname, image, friend_request_accepted
            FROM friendships
            JOIN users
            ON (friend_request_accepted = false AND recipient_id = $1 AND sender_id = users.id)
            OR (friend_request_accepted = true AND recipient_id = $1 AND sender_id = users.id)
            OR (friend_request_accepted = true AND sender_id = $1 AND recipient_id = users.id);
            `,
            [user_id]
        )
        .then(({ rows }) => rows);
};

exports.getLatestChatMessages = () => {
    return database
        .query(
            `
            SELECT * FROM
            (SELECT chatroom.id, chatroom.sender_id, chatroom.message, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS date, users.forename, users.surname, users.image
            FROM users
            JOIN chatroom
            ON users.id = chatroom.sender_id
            ORDER BY id DESC
            LIMIT 10) showlasttenmessages
            ORDER BY id ASC;
            `
        )
        .then(({ rows }) => rows);
};

exports.addChatMessage = (sender_id, message) => {
    return database
        .query(
            `
            INSERT INTO chatroom (sender_id, message)
            VALUES ($1, $2);
            `,
            [sender_id, message]
        )
        .then(({ rows }) => rows);
};

exports.getBirthdays = () => {
    return database
        .query(
            `
            SELECT id, forename, surname, image, biography, birthday_day, birthday_month, birthday_year
            FROM users;
            `
        )
        .then(({ rows }) => rows);
};
