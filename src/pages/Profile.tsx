import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getSelf, updateProfile } from "../api/profile";
import { ApiProfile as Profile } from "../types/apiResponses";
import DefaultSpinner from "../components/DefaultSpinner";
import useDelayUnmount from "../hooks/useDelayUnmount";
import ReusableModal from "../components/ReusableModal";
import ChangeEmailModal from "../components/modals/ChangeEmailModal";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import ChangeZipModal from "../components/modals/ChangeZipModal";
import Button, { IButtonMode } from "../components/Button";
import InputField from "../components/InputField";
import { media } from "../styles/media";
import {
  Breakpoints,
  MinBreakpoints,
  useMediaQuery,
} from "../lib/hooks/useMediaQuery";
import { colors } from "../styles/Colors";
import { Icon, IconShape, Icons } from "../components/icon";
import { Application } from "../store";
import { useNavigate } from "react-router";
import { observer } from "mobx-react";

const ProfilePage = observer(({ ...props }) => {
  const navigate = useNavigate();
  // const [profile, setProfile] = useState<Profile>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("profile");
  const [isChangeNameOpen, setIsChangeNameOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangeZipOpen, setIsChangeZipOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [zip, setZip] = useState("");

  const isChangeNameTransitionedIn = useDelayUnmount(isChangeNameOpen, 420);
  const isChangeEmailTransitionedIn = useDelayUnmount(isChangeEmailOpen, 420);
  const isChangePasswordTransitionedIn = useDelayUnmount(
    isChangePasswordOpen,
    420
  );
  const isZipTransitionedIn = useDelayUnmount(isChangeZipOpen, 420);
  const isDesktop = useMediaQuery(MinBreakpoints.mobile, "min");

  const profile = Application.session.user.profile;
  const isLoggedIn = Application.session.user.isAuthenticated;

  const handleCloseChangeName = () => {
    setNewFirstName("");
    setNewLastName("");
    setIsChangeNameOpen(false);
  };

  const handleSignOut = () => {
    Application.session.user.logout();
    navigate("/");
  };

  const handleChangeName = async () => {
    try {
      if (isLoggedIn) {
        let newName = newFirstName + " " + newLastName;
        const profileResponse = await updateProfile(newName);
        if (profileResponse) {
          Application.session.user.getSelf();
        }
      }
      setNewFirstName("");
      setNewLastName("");
      setIsChangeNameOpen(false);
    } catch (e) {
      console.log("Failed to fetch profile", e);
    }
  };

  const handleEmailChange = (e: string) => {
    Application.session.user.getSelf();
  };

  const renderChangeEmailModal = () => {
    return (
      <ChangeEmailModal
        isOpen={
          isChangeEmailTransitionedIn
            ? isChangeEmailOpen
            : isChangeEmailTransitionedIn
        }
        onClose={() => setIsChangeEmailOpen(false)}
        email={profile!.email}
        setEmail={(e) => handleEmailChange(e)}
      />
    );
  };

  const renderChangePasswordModal = () => {
    return (
      <ChangePasswordModal
        isOpen={
          isChangePasswordTransitionedIn
            ? isChangePasswordOpen
            : isChangePasswordTransitionedIn
        }
        onClose={() => setIsChangePasswordOpen(false)}
      />
    );
  };

  const renderChangeZipModal = () => {
    return (
      <ChangeZipModal
        isOpen={isZipTransitionedIn ? isChangeZipOpen : isChangeZipOpen}
        onClose={() => setIsChangeZipOpen(false)}
      />
    );
  };

  const renderChangeNameModal = () => {
    return (
      <ChangeNameModal
        title="Update Name"
        isOpen={
          isChangeNameTransitionedIn
            ? isChangeNameOpen
            : isChangeNameTransitionedIn
        }
        onClose={() => handleCloseChangeName()}
      >
        <InputField
          placeholder="First Name"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <InputField
          placeholder="Last Name"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <ButtonWrapper>
          <CancelButton
            onClick={() => {
              handleCloseChangeName();
            }}
            color="#18141D1A"
          >
            <CancelButtonText>Cancel</CancelButtonText>
          </CancelButton>
          <ConfirmButton
            mode={IButtonMode.PURPLE}
            onClick={() => {
              handleChangeName();
            }}
            disabled={newFirstName === "" || newLastName === ""}
          >
            <ConfirmButtonText>Submit</ConfirmButtonText>
          </ConfirmButton>
        </ButtonWrapper>
      </ChangeNameModal>
    );
  };

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>My Account</HeaderTitle>
      </Header>
      <ProfileWrapper>
        <Tabs>
          <Tab
            onClick={() => setCurrentTab("profile")}
            isSelected={currentTab === "profile"}
          >
            <TabText>Profile</TabText>
            {isDesktop && (
              <Icon
                provider={Icons}
                shape={IconShape.ARROW_RIGHT}
                height={12}
              />
            )}
          </Tab>
        </Tabs>
        <ContentWrapper>
          <InfoSection>
            <Avatar>{profile?.name ? profile.name[0] : "M"}</Avatar>
            <NameWrapper>
              <Name>{profile?.name}</Name>
              <ChangeName onClick={() => setIsChangeNameOpen(true)}>
                Change Name
              </ChangeName>
            </NameWrapper>
          </InfoSection>
          <CredentialsSection>
            <CredentialsHeader>Login & Security</CredentialsHeader>
            <CredentialsContent>
              <Credential>
                <CredentialItem>{profile?.email}</CredentialItem>
                <CredentialAction onClick={() => setIsChangeEmailOpen(true)}>
                  change email
                </CredentialAction>
              </Credential>
              <Credential>
                <CredentialItem>Password: ********</CredentialItem>
                <CredentialAction onClick={() => setIsChangePasswordOpen(true)}>
                  change password
                </CredentialAction>
              </Credential>
              <Credential>
                <CredentialItem>Zip: {profile?.zipcode}</CredentialItem>
                <CredentialAction onClick={() => setIsChangeZipOpen(true)}>
                  change zip
                </CredentialAction>
              </Credential>
            </CredentialsContent>
          </CredentialsSection>
          <div className="Profile__Buttons">
            <Button mode={IButtonMode.GREY} onClick={handleSignOut}>
              Log Out
            </Button>
          </div>
        </ContentWrapper>
      </ProfileWrapper>

      {(isChangeNameOpen || isChangeNameTransitionedIn) &&
        renderChangeNameModal()}
      {(isChangeEmailOpen || isChangeEmailTransitionedIn) &&
        renderChangeEmailModal()}
      {(isChangePasswordOpen || isChangePasswordTransitionedIn) &&
        renderChangePasswordModal()}
      {(isChangeZipOpen || isZipTransitionedIn) && renderChangeZipModal()}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  padding: 90px 20px 20px 20px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  background: linear-gradient(180deg, #161517 0%, #332f36 100%);
`;

const SpinnerWrapper = styled.div`
  display: flex;
  min-height: 550px;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const SharedText = styled.div`
  color: #fff;
  font-family: "Open Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 80%; /* 14.4px */
  letter-spacing: -0.36px;
`;

const HeaderTitle = styled(SharedText)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const ProfileWrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex-shrink: 0;
  align-self: stretch;
  ${media.desktop} {
    padding: 40px;
    gap: 40px;
    flex-direction: row;
    justify-content: center;
    /* min-width: 700px; */
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: flex-start;
`;
const Tab = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex: 1 0 0;
  padding: 4px 10px;
  align-items: center;
  gap: 14px;
  background: ${(props) => (props.isSelected ? "#18141D" : "transparent")};
  color: ${(props) => (props.isSelected ? colors.white : colors.black)};
  opacity: ${(props) => (props.isSelected ? "1" : "0.5")};
  cursor: pointer;
  ${media.desktop} {
    width: 200px;
    padding: 20px;
    justify-content: space-between;
    color: ${(props) => (props.isSelected ? colors.black : colors.white)};
    background: ${(props) => (props.isSelected ? colors.gray5 : "transparent")};
    svg path {
      fill: ${colors.purple};
    }
  }
`;
const TabText = styled(SharedText)`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: unset;
  color: unset;
  ${media.desktop} {
    font-weight: 400;
    letter-spacing: -0.42px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  align-self: stretch;
  min-height: 500px;
  ${media.desktop} {
    min-width: 500px;
    flex: unset;
  }
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;

const Avatar = styled(SharedText)`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  border-radius: 100px;
  width: 125px;
  height: 125px;
  background: #6c47ff;
  justify-content: center;
  align-items: center;
  font-size: 50px;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

const ChangeName = styled(SharedText)`
  color: #6c47ff;
  font-family: Open Sans;
  font-size: 12px;

  font-weight: 400;
  cursor: pointer;
`;

const Name = styled(SharedText)`
  color: #000;
  font-family: Open Sans;
  letter-spacing: -0.54px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const CancelButton = styled(Button)`
  flex: 1 0 0;
`;

const CancelButtonText = styled(SharedText)`
  color: #18141d;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.28px;
  ${CancelButton}:hover & {
    color: ${colors.white};
  }
`;
const ConfirmButtonText = styled(CancelButtonText)`
  color: #fff;
`;
const ConfirmButton = styled(CancelButton)``;

const ChangeNameModal = styled(ReusableModal)`
  gap: 20px;
`;

const CredentialsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const CredentialsHeader = styled(SharedText)`
  display: flex;
  padding: 20px 0px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-bottom: 2px solid var(--Purple, #6c47ff);
  color: #8b898e;
  font-family: Open Sans;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

const CredentialsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;

  border: 1px solid #e8e7e8;
  & > :first-child {
    border-top: none;
  }
`;

const Credential = styled.div`
  display: flex;
  padding: 20px;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  border-top: 1px solid #e8e7e8;
`;

const CredentialItem = styled(SharedText)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  color: #18141d;
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 400;

  letter-spacing: -0.42px;
  align-self: stretch;
`;

const CredentialAction = styled(SharedText)`
  color: #6c47ff;
  font-family: Open Sans;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;
// color: #fff;
// font-family: "Open Sans";
// font-size: 18px;
// font-style: normal;
// font-weight: 700;
// line-height: 80%; /* 14.4px */
// letter-spacing: -0.36px;

export default ProfilePage;
