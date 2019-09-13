import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <article>
                <h1>The world is black and white, until you see the color</h1>
                <img src="/social-network-logo.png" className="welcome-image" />
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </article>
        </HashRouter>
    );
}
