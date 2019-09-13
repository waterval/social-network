import React from "react";
import BiographyEditor from "./biography-editor";
import axios from "../app/axios";
import { render, fireEvent, waitForElement } from "@testing-library/react";

jest.mock("./axios");

test("When no bio is passed to it, an Add button is rendered.", () => {
    const { container } = render(<BiographyEditor />);
    expect(container.querySelector("div").innerHTML).toContain("Add biography");
});

test("When a bio is passed to it, an Edit button is rendered.", () => {
    const { container } = render(<BiographyEditor biographyText="bio" />);
    expect(container.querySelector("div").innerHTML).toContain(
        "Edit biography"
    );
});

test("Clicking either the Add or Edit button causes a textarea and a Save button to be rendered.", () => {
    const { container } = render(<BiographyEditor biographyText="bio" />);

    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector("div").innerHTML).toContain("textarea");

    expect(container.querySelector("div").innerHTML).toContain(
        "Save biography"
    );
});

test("Clicking the Save button causes an ajax request.", async () => {
    axios.post.mockResolvedValue({});
    const { container } = render(<BiographyEditor biographyText="bio" />);
    expect(container.querySelector("button").innerHTML).toContain(
        "Edit biography"
    );
    fireEvent.click(container.querySelector("button"));
    expect(container.querySelector("div").innerHTML).toContain(
        "Save biography"
    );
    const button = await waitForElement(() =>
        container.querySelector("button")
    );
    fireEvent.click(container.querySelector("button"));
    expect(axios.post.mock.calls.length).toBe(1);
});
