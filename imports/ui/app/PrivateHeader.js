import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import Modal from "react-modal";

import history from "../../api/history";

export const PrivateHeader = props => {
    const navImgSrc = props.isNavOpen ? "/images/x.svg" : "/images/bars.svg";
    this.state = {isOpen : false};

    toggleModal = () =>{
        this.state.isOpen = !this.state.isOpen;
    }

    return (
        <div className="header">
            <div className="header__content">
                <img
                    className="header__nav-toggle"
                    src={navImgSrc}
                    alt="nav"
                    onClick={props.toggleNav}
                />

                <h1
                    className="header__title"
                    onClick={() => history.replace("/dashboard")}
                >
                    {props.title}
                </h1>
				<h1 
                    className="header__profile"
                    onClick={this.toggleModal()}
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
                    onClick={props.handleLogout}
                >
                    Logout
                </button>
                <Modal
                    show={this.state.isOpen}
                    onClose={this.toggleModal()}
                >
                    Hello
                    <button onClick={this.toggleModal}>close</button>
                </Modal>
            </div>
            
        </div>
    );
};

PrivateHeader.propTypes = {
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
})(PrivateHeader);
