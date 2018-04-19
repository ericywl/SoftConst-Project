// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// APIs
import history from "../../startup/history";

export const PrivateHeader = props => {
    const navImgSrc = props.isNavOpen ? "/images/x.svg" : "/images/bars.svg";

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

                <div className="header__right-wrapper">
                    <img
                        className="header__profile"
                        src="/images/people.png"
                        onClick={() => {
                            history.replace("/profile");
                            Session.set("selectedProfileId", "");
                        }}
                    />

                    <button
                        className="button button--title"
                        onClick={props.handleLogout}
                    >
                        Logout
                    </button>
                </div>
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
        handleLogout: () => {
            Session.set("selectedTab", "groups");
            Session.set("selectedDsbjId", "");
            Session.set("selectedGroupId", "");
            Session.set("selectedProfileId", "");
            Session.set("selectedRoom", "announcements");
            Session.set("chatQuery", "");
            Session.set("profileQuery", "");
            Session.set("sentToGroup", "");
            Session.set("newMessage", false);
            Session.set("isNavOpen", false);
            Session.set("isModalOpen", false);
            Session.set("sessionTime", moment().valueOf());
            Accounts.logout();
        },
        toggleNav: () => Session.set("isNavOpen", !Session.get("isNavOpen")),
        isNavOpen: Session.get("isNavOpen")
    };
})(PrivateHeader);
