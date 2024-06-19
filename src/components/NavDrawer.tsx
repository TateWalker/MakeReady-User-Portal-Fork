import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import Button, { IButtonMode, IButtonSize } from "./Button";
import { Link, useNavigate } from "react-router-dom";
import ArrowRight from "../static/icons/ArrowRight";
import { getMyPlaylists } from "../api/playlist";
import Play from "../static/icons/Play";
import { MainContext } from "../contexts/MainContext";
import { Types } from "../contexts/types";
import { getSubscriptions } from "../api/subscriptions";
import { observer } from "mobx-react";
import { IconShape } from "./icon";
import { classnames } from "../lib/utils/classnames";

import "./styles/NavDrawer.scss";
import { Application } from "../store";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavDrawer = observer(({ ...props }: IProps) => {
  const { isOpen, onClose } = props;
  const { state, dispatch } = useContext(MainContext);

  // Get login status
  const isLoggedIn = Application.session.user.isAuthenticated;
  const user = Application.session.user;

  const links = [
    { name: "Home", path: "/" },
    { name: "Series", path: "/series" },
    { name: "Give", path: "/give" },
    { name: "About", path: "/about" },
  ];

  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    Application.session.user.logout();
    handleNavigate("/");
  };

  const renderAuthenticated = () => {
    return (
      <AuthenticatedWrapper>
        <ProfileWrapper onClick={() => handleNavigate("/profile")}>
          <ProfileBubble>
            <ProfileBubbleText>
              {user ? Array.from(user.displayName)[0] : "M"}
            </ProfileBubbleText>
          </ProfileBubble>
          <ProfileInfo>
            <ProfileName>
              {user ? user.displayName : "MakeReady User"}
            </ProfileName>
            <ProfileSmallText>{user.profile?.email}</ProfileSmallText>
          </ProfileInfo>
        </ProfileWrapper>
        <LogoutText onClick={() => handleLogout()}>Log Out</LogoutText>
      </AuthenticatedWrapper>
    );
  };

  const renderUnauthenticated = () => {
    return (
      <>
        <Button
          mode={IButtonMode.PRIMARY}
          onClick={() => handleNavigate("/auth")}
        >
          Sign Up
        </Button>
        <Button
          mode={IButtonMode.SECONDARY}
          onClick={() => handleNavigate("/auth")}
        >
          Log In
        </Button>
      </>
    );
  };

  const renderUnauthenticatedPlaylists = () => {
    return (
      <Instructions>
        Create an account to save your favorite videos into playlists to watch
        later or share with others.
      </Instructions>
    );
  };

  const renderAuthenticatedPlaylists = () => {
    return (
      <PlaylistListWrapper>
        {Application.ui.playlist.firstFive.map((playlist, index) => (
          <PlaylistItem
            key={index}
            onClick={() => handleNavigate(`/playlist/${playlist.linkSlug}`)}
          >
            <PlayButton>
              <Play fill="#fff" />
            </PlayButton>
            <PlaylistName>{playlist.name}</PlaylistName>
            <PlaylistCount>{playlist.videoCount}</PlaylistCount>
          </PlaylistItem>
        ))}
      </PlaylistListWrapper>
    );
  };

  const handleClickClose = () => {
    onClose?.();
  };

  return (
    <div className={classnames("NavDrawer", isOpen ? "NavDrawer--open" : "")}>
      <div className={"NavDrawer__Account"}>
        <Account>ACCOUNT</Account>
        <Button
          iconShape={IconShape.CLOSE}
          mode={IButtonMode.ICON}
          size={IButtonSize.MEDIUM}
          transparent={true}
          onClick={handleClickClose}
        />
      </div>
      <div className={"NavDrawer__Buttons"}>
        {isLoggedIn ? renderAuthenticated() : renderUnauthenticated()}
      </div>
      <LinkWrapper>
        {links.map((link, index) => (
          <InternalLink key={index} to={link.path} onClick={() => onClose()}>
            <LinkText>{link.name}</LinkText>
          </InternalLink>
        ))}
      </LinkWrapper>
      <PlaylistWrapper>
        <PlaylistHeaderWrapper>
          <PlaylistLabel>Playlists</PlaylistLabel>
          {isLoggedIn ? (
            <ManagedButtonWrapper
              onClick={() => handleNavigate("/my_playlists")}
            >
              <ManagedText>Manage</ManagedText>
              <ArrowRight fill="#fff" />
            </ManagedButtonWrapper>
          ) : (
            <></>
          )}
        </PlaylistHeaderWrapper>
        {isLoggedIn
          ? renderAuthenticatedPlaylists()
          : renderUnauthenticatedPlaylists()}
      </PlaylistWrapper>
    </div>
  );
});

const Account = styled.div`
  color: #fff;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
  letter-spacing: 1.2px;
`;

const SharedText = styled.div`
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;

const LinkWrapper = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-top: 1px solid #ffffff1a;
  border-bottom: 1px solid #ffffff1a;
`;

const InternalLink = styled(Link)`
  display: flex;
  padding: 10px;
  align-items: flex-start;
  gap: 20px;
  text-decoration: none;
`;

const LinkText = styled(SharedText)`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
`;

const PlaylistWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const SharedPlaylistText = styled.div`
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
  color: #fff;
`;

const PlaylistLabel = styled(SharedPlaylistText)`
  letter-spacing: 1.2px;
  font-size: 14px;
  text-transform: uppercase;
`;

const Instructions = styled(SharedPlaylistText)`
  opacity: 0.5;
`;

const AuthenticatedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  cursor: pointer;
`;

const ProfileBubble = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #6c47ff;

  justify-content: center;
  align-items: center;
`;

const ProfileBubbleText = styled.div`
  color: white;
  font-size: 35px;
  margin-bottom: 3px;

  font-family: Open Sans;
  text-transform: uppercase;
  line-height: 24px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

const ProfileName = styled(SharedText)`
  color: #fff;
  line-height: 80%; /* 11.2px */
  letter-spacing: unset;
`;

const ProfileSmallText = styled(SharedText)`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 80%; /* 11.2px */
  letter-spacing: unset;
`;

const LogoutText = styled(ProfileSmallText)`
  cursor: pointer;
`;

const PlaylistHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ManagedButtonWrapper = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 10px;
`;

const ManagedText = styled(SharedText)`
  color: #fff;
  line-height: unset;
`;

const PlaylistListWrapper = styled.div`
  display: flex;
  padding: 11px 0;
  padding-top: 21px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const PlaylistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const PlayButton = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: #ffffff33;
  & svg {
    position: relative;
    right: 1px;
  }
`;

const PlaylistName = styled(SharedPlaylistText)`
  font-size: 14px;
  font-weight: 700;
  line-height: 80%; /* 11.2px */
`;

const PlaylistCount = styled(SharedPlaylistText)`
  font-size: 14px;
  line-height: 80%; /* 11.2px */
  opacity: 0.5;
`;

export default NavDrawer;
