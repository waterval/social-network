import React from "react";
import BiographyEditor from "./biography-editor";
import ProfilePicture from "./profile-picture";
import AddBirthday from "./add-birthday";

export default function UserProfile({
    forename,
    surname,
    image,
    showUploadOption,
    biographyText,
    updateBiography,
    displaySize,
    birthdayDay,
    birthdayMonth,
    birthdayYear,
    updateBirthdayDay,
    updateBirthdayMonth,
    updateBirthdayYear
}) {
    return (
        <div>
            <div>
                <h1>
                    Profile of {forename} {surname}
                </h1>
            </div>
            <div>
                <ProfilePicture
                    displaySize={displaySize}
                    forename={forename}
                    surname={surname}
                    image={image}
                    showUploadOption={showUploadOption}
                />
            </div>

            <div>
                <h2>Biography:</h2>
                {!biographyText && <p>There is currently no biography.</p>}
                {biographyText && <p>{biographyText}</p>}
            </div>
            <div>
                <BiographyEditor
                    biographyText={biographyText}
                    updateBiography={updateBiography}
                />
            </div>
            <div>
                <h2>Birthday:</h2>
                {!birthdayDay && !birthdayMonth && !birthdayYear && (
                    <p>The date of your birthday is currently unknown.</p>
                )}
                {(birthdayDay || birthdayMonth || birthdayYear) && (
                    <p>
                        {birthdayDay} - {birthdayMonth} - {birthdayYear}
                    </p>
                )}
            </div>
            <div>
                <AddBirthday
                    birthdayDay={birthdayDay}
                    birthdayMonth={birthdayMonth}
                    birthdayYear={birthdayYear}
                    updateBirthdayDay={updateBirthdayDay}
                    updateBirthdayMonth={updateBirthdayMonth}
                    updateBirthdayYear={updateBirthdayYear}
                />
            </div>
        </div>
    );
}
