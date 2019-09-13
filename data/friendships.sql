CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    recipient_id INT REFERENCES users(id),
    friend_request_accepted BOOLEAN DEFAULT false
);
