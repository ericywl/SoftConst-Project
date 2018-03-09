import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

import { validateNewUser } from "../api/users";

export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    }

    onSubmit(event) {
        event.preventDefault();

        let email = this.refs.email.value.trim();
        let password = this.refs.password.value;
        try {
            validateNewUser(email, password);
        } catch (e) {
            return this.setState({ error: e.reason });
        }

        this.props.createUser({ email, password }, err => {
            if (err) {
                this.setState({ error: err.reason });
            } else {
                this.setState({ error: "" });
            }
        });
    }

    render() {
        return (
            <div className="boxed-view">
                <div className="boxed-view__box">
                    <h1>Signup</h1>

                    {this.state.error ? <p>{this.state.error}.</p> : undefined}

                    <form
                        onSubmit={this.onSubmit.bind(this)}
                        noValidate
                        className="boxed-view__form"
                    >
                        <input
                            type="email"
                            ref="email"
                            name="email"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            ref="password"
                            name="password"
                            placeholder="Password"
                        />
                        <button className="button">Create Account</button>
                    </form>

                    <Link to="/">Already have an account?</Link>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    return {
        createUser: Accounts.createUser
    };
})(Signup);
