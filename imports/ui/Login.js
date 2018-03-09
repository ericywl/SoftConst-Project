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

        let email = this.refs.email.value.trim();
        let password = this.refs.password.value;
        this.props.loginWithPassword({ email }, password, err => {
            if (err) {
                this.setState({
                    error:
                        "Unable to login. " +
                        "Please check your email and password."
                });
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
                        <button className="button">Login</button>
                    </form>

                    <Link to="/signup">Don't have an account?</Link>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginWithPassword: PropTypes.func.isRequired
};

export default withTracker(() => {
    return { loginWithPassword: Meteor.loginWithPassword };
})(Login);
