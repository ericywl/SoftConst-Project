// Library
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    }

    onSubmit(event) {
        event.preventDefault();

        let user = this.refs.user.value.trim();
        let password = this.refs.password.value;
        this.props.loginWithPassword(user, password, err => {
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
            <div className="boxed-view">
                <div className="boxed-view__box">
                    <h1>Login</h1>

                    {this.state.error ? <p>{this.state.error}</p> : undefined}

                    <form
                        onSubmit={this.onSubmit.bind(this)}
                        noValidate
                        className="boxed-view__form"
                    >
                        <input
                            type="text"
                            ref="user"
                            name="user"
                            placeholder="Email or Username"
                        />
                        <input
                            type="password"
                            ref="password"
                            name="password"
                            placeholder="Password"
                        />
                        <button className="button">Login</button>
                    </form>

                    {this.props.isTesting ? (
                        undefined
                    ) : (
                        <Link to="/signup">Don't have an account?</Link>
                    )}
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginWithPassword: PropTypes.func.isRequired,
    isTesting: PropTypes.bool.isRequired
};

export default withTracker(() => {
    return {
        loginWithPassword: Meteor.loginWithPassword,
        isTesting: false
    };
})(Login);
