// Library
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

// APIs
import { validateNewUserClient } from "../../api/users";

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
        let username = this.refs.username.value.trim();

        try {
            validateNewUserClient({ username, email, password });
        } catch (e) {
            this.setState({ error: e.reason });
            setTimeout(() => this.setState({ error: "" }), 10000);
            return;
        }

        this.props.createUser({ username, email, password }, err => {
            if (err) {
                this.setState({ error: err.reason });
                setTimeout(() => this.setState({ error: "" }), 10000);
            } else {
                this.setState({ error: "" });
            }
        });
    }

    render() {
        return (
            <div className="boxed-view boxed-view--auth">
                <div className="boxed-view__box">
                    <h1>Signup</h1>

                    {this.state.error ? <p>{this.state.error}</p> : undefined}

                    <form
                        onSubmit={this.onSubmit.bind(this)}
                        noValidate
                        className="boxed-view__form"
                    >
                        <input
                            type="text"
                            ref="username"
                            name="username"
                            placeholder="Username"
                        />
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

                    {this.props.isTesting ? (
                        undefined
                    ) : (
                        <Link to="/">Already have an account?</Link>
                    )}
                </div>
            </div>
        );
    }
}

Signup.propTypes = {
    createUser: PropTypes.func.isRequired,
    isTesting: PropTypes.bool.isRequired
};

export default withTracker(() => {
    return {
        createUser: Accounts.createUser,
        isTesting: false
    };
})(Signup);
