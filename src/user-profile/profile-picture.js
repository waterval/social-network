import React from "react";

export default function ProfilePicture({
    forename,
    surname,
    image,
    showUploadOption,
    displaySize,
    ownClass
}) {
    return (
        <div className={ownClass}>
            <img
                width={displaySize}
                height={displaySize}
                onClick={showUploadOption}
                src={image}
                alt={`${forename} ${surname}`}
                className="user-image"
            />
            <img
                onClick={showUploadOption}
                src="https://static.thenounproject.com/png/625182-200.png"
                className="user-upload-icon"
            />
        </div>
    );
}
