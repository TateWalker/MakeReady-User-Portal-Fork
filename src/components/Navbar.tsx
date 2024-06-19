import React, { useContext, useEffect, useState } from "react";
import NavDrawer from "./NavDrawer";
import SearchSlideUp from "./SearchSlideUp";
import { useLocation, useNavigate } from "react-router-dom";

import "./styles/NavBar.scss";
import { classnames } from "../lib/utils/classnames";
import { Icon, IconShape, Icons } from "./icon";
import { Application } from "../store";
import { observer } from "mobx-react";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import { when } from "../lib/utils/when";

// Sync with existing state main context
import { MainContext } from "../contexts/MainContext";
import { Types } from "../contexts/types";

const NavBar = observer(({ ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: Temporary fix syncing with existing state
  const { state, dispatch } = useContext(MainContext);

  // TODO: Sync with Tate's state hooks

  // Mobile media query
  const isMobile = useMediaQuery(Breakpoints.mobile);

  // Track modal states
  const searchOpen = Application.ui.search.active;
  const menuOpen = Application.ui.menu.active;

  // Check login
  const login = Application.session.user.isAuthenticated;

  const handleNavBarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleHamburgerClick = (e: React.MouseEvent) => {
    Application.ui.search.close();
    Application.ui.menu.toggleActive();
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    Application.ui.menu.close();
    Application.ui.search.toggleActive();
  };

  const closeModals = () => {
    Application.ui.search.close();
    Application.ui.menu.close();
  };

  // TODO: This really belongs in environment variables, but whatevs, haha.
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Series",
      path: "/series",
    },
    {
      name: "Give",
      path: "/give",
    },
    {
      name: "About",
      path: "/about",
    },
  ];

  const handleLinkClick = (path: string) => {
    closeModals();
    navigate(path);
  };

  const handleLoginClick = () => {
    closeModals();
    navigate("/auth");
  };

  const handleSignUpClick = () => {
    closeModals();
    navigate("/auth");
  };

  const handleProfileClick = () => {
    closeModals();
    navigate("/profile");
  };

  const handlePlaylistsClick = () => {
    closeModals();
    navigate("/my_playlists");
  };

  const handleLogoClick = () => {
    closeModals();
    navigate("/");
  };

  // dispatch({ type: Types.SetUser, payload: { user } });
  // When login changes, setUser with payload of Application.ui.user.profile
  React.useEffect(() => {
    if (
      Application.session.user.isAuthenticated &&
      Application.session.user.profile
    ) {
      dispatch({
        type: Types.SetUser,
        payload: { user: Application.session.user.profile },
      });
    }
  }, [Application.session.user.isAuthenticated]);

  // Close modals when hitting escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModals();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const renderMobile = () => {
    return (
      <div
        className={classnames(
          "NavBar",
          "NavBar--mobile",
          menuOpen ? "NavBar--menu-open" : "",
          searchOpen ? "NavBar--search-open" : ""
        )}
        onClick={handleNavBarClick}
      >
        <div className={"NavBar__Content"}>
          <div className="NavBar__Menu">
            <Icon
              provider={Icons}
              shape={IconShape.HAMBURGER_MENU}
              size={20}
              onClick={handleHamburgerClick}
            />
          </div>
          <div className={"NavBar__Logo"} onClick={handleLogoClick}>
            <Icon provider={Icons} shape={IconShape.LOGO_FULL} height={30} />
          </div>
          <div className="NavBar__Search" onClick={handleSearchClick}>
            <Icon provider={Icons} shape={IconShape.SEARCH} size={20} />
          </div>
        </div>
        <NavDrawer isOpen={menuOpen} onClose={closeModals} />
        {when(searchOpen, <SearchSlideUp onClose={closeModals} />)}
      </div>
    );
  };

  // Desktop nav bar
  const renderDesktop = () => {
    return (
      <div
        className={classnames(
          "NavBar",
          "NavBar--desktop",
          menuOpen ? "NavBar--menu-open" : "",
          searchOpen ? "NavBar--search-open" : ""
        )}
        onClick={handleNavBarClick}
      >
        <div className="NavBar__Left">
          <div className={"NavBar__Logo"} onClick={handleLogoClick}>
            <Icon provider={Icons} shape={IconShape.LOGO_FULL} height={30} />
          </div>
          <div className="NavBar__Links">
            {links.map((link, index) => {
              return (
                <div
                  key={index}
                  className={classnames(
                    "NavBar__Link",
                    location.pathname === link.path
                      ? "NavBar__Link--active"
                      : ""
                  )}
                  onClick={() => handleLinkClick(link.path)}
                >
                  {link.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="NavBar__Right">
          <div
            className={classnames(
              "NavBar__Link",
              "NavBar__Link--icon",
              searchOpen ? "NavBar__Link--active" : ""
            )}
            onClick={handleSearchClick}
          >
            <Icon provider={Icons} shape={IconShape.SEARCH} size={20} />
            Search
          </div>
          {when(
            !login,
            <>
              <div className="NavBar__Link" onClick={handleSignUpClick}>
                Sign Up
              </div>
              <div className="NavBar__Link" onClick={handleLoginClick}>
                Log In
              </div>
            </>,
            <>
              <div
                className={classnames(
                  "NavBar__Link",
                  location.pathname === "/my_playlists"
                    ? "NavBar__Link--active"
                    : ""
                )}
                onClick={handlePlaylistsClick}
              >
                Playlists
              </div>
              <div
                className={classnames(
                  "NavBar__Link",
                  location.pathname === "/profile" ? "NavBar__Link--active" : ""
                )}
                onClick={handleProfileClick}
              >
                {Application.session.user.displayName}
              </div>
            </>
          )}
        </div>
        {when(searchOpen, <SearchSlideUp onClose={closeModals} />)}
      </div>
    );
  };

  return isMobile ? renderMobile() : renderDesktop();
});

export default NavBar;
