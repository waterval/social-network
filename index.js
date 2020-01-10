const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "192.168.50.*:8080" });
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./utilities/s3");
const config = require("./utilities/config");
const bcrypt = require("./utilities/bcrypt");
const database = require("./data/database");

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (request, response) =>
        response.sendFile(`${__dirname}/bundle.js`)
    );
}

const diskStorage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(request, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(require("body-parser").json());

const cookieSessionMiddleware = cookieSession({
    secret: `#f29(*De).`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static("./public"));

app.use(csurf());

app.use((request, response, next) => {
    response.cookie("mytoken", request.csrfToken());
    next();
});

app.get("/welcome", function(request, response) {
    if (request.session.userId) {
        response.redirect("/");
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", async (request, response) => {
    try {
        const { forename, surname, email, password } = request.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        const userData = await database.addUser(
            forename,
            surname,
            email,
            hashedPassword
        );
        const userId = userData.id;
        request.session.userId = userId;
        request.session.userForename = forename;
        request.session.userSurname = surname;
        response.json({
            registrationValid: true
        });
    } catch (error) {
        console.log("error inside post /register: ", error);
        response.json({
            registrationValid: false
        });
    }
});

app.post("/login", async (request, response) => {
    const { email, password } = request.body;
    try {
        const userData = await database.getHashedPassword(email);
        const hashedPassword = userData.password;
        const passwordValid = await bcrypt.checkPassword(
            password,
            hashedPassword
        );
        if (passwordValid) {
            request.session.userId = userData.id;
            request.session.userForename = userData.forename;
            request.session.userSurname = userData.surname;
        }
        response.json({
            passwordValid: passwordValid
        });
    } catch (error) {
        console.log("error inside post /login: ", error);
        response.json({
            passwordValid: false
        });
    }
});

app.get("/user-data", async (request, response) => {
    const { userId } = request.session;
    try {
        const userData = await database.getUserData(userId);
        userData.birthdayDay = userData.birthday_day;
        userData.birthdayMonth = userData.birthday_month;
        userData.birthdayYear = userData.birthday_year;
        response.json({ userData });
    } catch (error) {
        console.log("error inside get /user-data: ", error);
    }
});

app.post(
    "/upload-image",
    uploader.single("file"),
    s3.upload,
    async (request, response) => {
        const { userId } = request.session;
        const imageUrl = config.s3Url + request.file.filename;
        try {
            const userImage = await database.addUserImage(userId, imageUrl);
            response.json({
                image: userImage.image
            });
        } catch (error) {
            console.log("error inside post /upload-image: ", error);
        }
    }
);

app.post("/add-biography", async (request, response) => {
    const { userId } = request.session;
    const { biography } = request.body;
    try {
        const results = await database.addUserBiography(userId, biography);
        response.json({ biography: results.biography });
    } catch (error) {
        console.log("error inside post /add-biography: ", error);
    }
});

app.post("/add-birthday", async (request, response) => {
    const { userId } = request.session;
    const { birthdayDay, birthdayMonth, birthdayYear } = request.body;
    try {
        await database.addUserBirthday(
            userId,
            birthdayDay,
            birthdayMonth,
            birthdayYear
        );
        response.json({ birthdaySuccess: true });
    } catch (error) {
        console.log("error inside post /add-birthday: ", error);
    }
});

app.get("/api/birthdays", async (request, response) => {
    try {
        const users = await database.getBirthdays();
        response.json({ users });
    } catch (error) {
        console.log("error inside get /api/birthdays: ", error);
    }
});

app.get("/api/users/profile/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const { userId } = request.session;
        const otherData = await database.getUserData(id);
        if (id == userId) {
            otherData.onUserProfile = true;
        }
        response.json({ otherData });
    } catch (error) {
        console.log("error inside get /api/users/profile/:id: ", error);
    }
});

app.get("/api/users/find/:searchQuery", async (request, response) => {
    try {
        let data;
        if (request.params.searchQuery == "undefined") {
            data = await database.getNewestUsers();
        } else {
            const { searchQuery } = request.params;
            data = await database.getSearchedUsers(searchQuery);
        }
        response.json({ data });
    } catch (error) {
        console.log("error inside get /api/users/find/:searchQuery: ", error);
    }
});

app.get("/api/users/friendship-status/:otherId", async (request, response) => {
    const { userId } = request.session;
    const { otherId } = request.params;
    try {
        let data = await database.getFriendshipStatus(userId, otherId);
        if (!data) {
            let data = {};
            data.friendButtonText = "Add friend";
            response.json(data);
            return;
        }
        data.friendAccepted = data.friend_request_accepted;
        if (data.friendAccepted) {
            data.friendButtonText = "Remove friend";
        }
        if (!data.friendAccepted && data.sender_id == userId) {
            data.friendButtonText = "Cancel friend request";
        }
        if (!data.friendAccepted && data.recipient_id == userId) {
            data.friendButtonText = "Accept friend request";
        }
        response.json(data);
    } catch (error) {
        console.log(
            "error inside get /api/users/friendship-status/:otherId: ",
            error
        );
    }
});

app.post(
    "/api/users/friendship-status/:otherId/:buttonText",
    async (request, response) => {
        const { userId } = request.session;
        const { otherId } = request.params;
        const { buttonText } = request.params;
        try {
            if (buttonText == "Add friend") {
                await database.addFriendRequest(userId, otherId);
                response.json({ tableUpdated: true });
            }
            if (buttonText == "Accept friend request") {
                await database.acceptFriendRequest(userId, otherId);
                response.json({ tableUpdated: true });
            }
            if (
                buttonText == "Remove friend" ||
                buttonText == "Cancel friend request"
            ) {
                await database.deleteFriendOrRequester(userId, otherId);
                response.json({ tableUpdated: true });
            }
        } catch (error) {
            console.log(
                "error inside post /api/users/friendship-status/:otherId/:buttonText: ",
                error
            );
        }
    }
);

app.get("/api/friends/requests", async (request, response) => {
    const { userId } = request.session;
    try {
        const users = await database.getFriendsAndRequesters(userId);
        response.json({ users });
    } catch (error) {
        console.log("error inside get /api/friends/requests: ", error);
    }
});

app.post(
    "/api/friends/remove-friend-requester/:otherId",
    async (request, response) => {
        const { userId } = request.session;
        const { otherId } = request.params;
        try {
            await database.deleteFriendOrRequester(userId, otherId);
            response.json({ success: true });
        } catch (error) {
            console.log(
                "error inside post /api/friends/remove-friend-requester/:otherId: ",
                error
            );
            response.json({ success: false });
        }
    }
);

app.post("/api/friends/accept-friend/:otherId", async (request, response) => {
    const { userId } = request.session;
    const { otherId } = request.params;
    try {
        await database.acceptFriendRequest(userId, otherId);
        response.json({ success: true });
    } catch (error) {
        console.log(
            "error inside post /api/friends/accept-friend/:otherId: ",
            error
        );
        response.json({ success: false });
    }
});

app.post("/api/friends/decline-friend/:otherId", async (request, response) => {
    const { userId } = request.session;
    const { otherId } = request.params;
    try {
        await database.deleteFriendOrRequest(userId, otherId);
        response.json({ success: true });
    } catch (error) {
        console.log(
            "error inside post /api/friends/decline-friend/:otherId: ",
            error
        );
        response.json({ success: false });
    }
});

app.get("*", (request, response) => {
    if (!request.session.userId) {
        response.redirect("/welcome");
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, () => console.log("App is listening!"));

io.on("connection", async socket => {
    const userId = socket.request.session.userId;
    try {
        const data = await database.getLatestChatMessages();
        socket.emit("Get Latest Chat Messages", data);
    } catch (error) {
        console.log(
            "error inside io.on connection in database.getLatestChatMessages: ",
            error
        );
    }

    socket.on("Add New Message", async message => {
        try {
            await database.addChatMessage(userId, message);
            const data = await database.getLatestChatMessages();
            const latestMessage = data.pop();
            io.sockets.emit("New Chat Message Added", latestMessage);
        } catch (error) {
            console.log(
                "error inside io.on connection in database.addChatMessage: ",
                error
            );
        }
    });
});
