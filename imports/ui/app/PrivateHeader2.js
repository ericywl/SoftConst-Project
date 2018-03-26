import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import Modal from "react-modal";

import history from "../../startup/history";
import Profile from "./profile/Profile.js"

export class PrivateHeader2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalIsOpen: false };
    }

    toggleModal() {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    }

    render() {
        const navImgSrc = this.props.isNavOpen
            ? "/images/x.svg"
            : "/images/bars.svg";

        return (
            <div className="header">
                <div className="header__content">
                    <img
                        className="header__nav-toggle"
                        src={navImgSrc}
                        alt="nav"
                        onClick={this.props.toggleNav}
                    />

                    <h1
                        className="header__title"
                        onClick={() => history.replace("/dashboard")}
                    >
                        {this.props.title}
                    </h1>

                    <h1
                        className="header__profile"
                        onClick={() => history.replace("/profile")}
                        //onClick={this.toggleModal.bind(this)}
                    >
                        Profile
                    </h1>

                    <h1
                        className="header__profile"
                        onClick={() => history.replace("/finder")}
                    >
                        Finder
                    </h1>

                    <button
                        className="button button--title"
                        onClick={this.props.handleLogout.bind(this)}
                    >
                        Logout
                    </button>

                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.toggleModal.bind(this)}
                        ariaHideApp={false}
                        className="boxed-view__large-box"
                        overlayClassName="boxed-view boxed-view--modal"
                        >
                        Hello
                        <Profile />
                    </Modal>
                </div>
            </div>
        );
    }
}

PrivateHeader2.propTypes = {
    title: PropTypes.string.isRequired,
    handleLogout: PropTypes.func.isRequired,
    toggleNav: PropTypes.func.isRequired,
    isNavOpen: PropTypes.bool.isRequired
};

export default withTracker(() => {
    return {
        handleLogout: () => Accounts.logout(),
        toggleNav: () => Session.set("isNavOpen", !Session.get("isNavOpen")),
        isNavOpen: Session.get("isNavOpen")
    };
})(PrivateHeader2);