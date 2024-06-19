import React, { useState, KeyboardEvent, useEffect, useContext } from "react";
import styled from "styled-components";
import { shareMessageTitle, shareMessageSubtitle } from "../lib/data/Share";
import {
  ApiVideo as Video,
  ApiPlaylist as Playlist,
  ApiSeries as Series,
  ApiFeaturedTag as FeaturedTag,
} from "../types/apiResponses";
import {
  shareFeatured,
  sharePlaylist,
  shareSeries,
  shareVideo,
} from "../api/share";
import IconBox from "./IconBox";
import Close from "../static/icons/Close";
import InputField from "./InputField";
import MultilineInputField from "./MultilineInputField";
import Trash from "../static/icons/Trash";
import ProfileImage from "../static/icons/ProfileImage";
import Button, { IButtonMode, IButtonSize } from "./Button";
import Check from "../static/icons/Check";
import { MainContext } from "../contexts/MainContext";
import { classnames } from "../lib/utils/classnames";
import { Icon, IconShape, Icons } from "./icon";

import "./styles/ShareModal.scss";
import { observer } from "mobx-react";
import TextAreaField from "./TextAreaField";

interface IProps {
  item: Video | Playlist | Series | FeaturedTag | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal = observer(({ ...props }) => {
  const { item, isOpen, onClose } = props;
  const [stepOne, setStepOne] = useState(true);
  const [contactList, setContactList] = useState<string[]>([]);
  const [contactInput, setContactInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);
  const { state, dispatch } = useContext(MainContext);
  let title = "";

  if (item) {
    if ("name" in item) {
      title = item.name; //Playlist/Series/FeaturedTag
    } else {
      title = item?.title; //Video
    }
  }

  const shareNow = async () => {
    if (item) {
      try {
        if (state.user) {
          const emails = contactList.filter((c) => c.includes("@"));
          const phones = contactList.filter((c) => !c.includes("@"));
          let response = false;
          if ("linkSlug" in item) {
            response = await sharePlaylist(
              emails,
              phones,
              messageInput,
              item.linkSlug
            );
          } else if ("tagline" in item) {
            response = await shareSeries(emails, phones, messageInput, item.id);
          } else if ("videoId" in item) {
            response = await shareVideo(emails, phones, messageInput, item.id);
          } else {
            response = await shareFeatured(
              emails,
              phones,
              messageInput,
              item.id
            );
          }
          if (response === true) {
            setShareSuccess(true);
            setTimeout(() => {
              onClose();
            }, 3000);
          }
        }
      } catch (error) {
        console.log("Failed to share", error);
      }
    }
  };

  const updateContactList = (contact: string, action: "add" | "remove") => {
    if (action === "add") {
      setContactList([...contactList, contact]);
      setContactInput("");
    } else if (action === "remove") {
      setContactList(contactList.filter((c) => c !== contact));
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      updateContactList(contactInput, "add");
    }
  };

  const renderShareSuccess = () => {
    return (
      <SuccessWrapper>
        <CheckIcon>
          <IconBox>
            <Check fill="#fff" />
          </IconBox>
        </CheckIcon>
        <SuccessTextWrapper>
          <SuccessTextMain>Message sent</SuccessTextMain>
        </SuccessTextWrapper>
      </SuccessWrapper>
    );
  };

  // Close modals when hitting escape
  React.useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <div className={classnames("ShareModal", isOpen ? "ShareModal--open" : "")}>
      {shareSuccess ? (
        renderShareSuccess()
      ) : (
        <>
          <TopWrapper>
            <HeaderWrapper>
              <HeaderText>Share</HeaderText>
              <IconBox onClick={() => onClose()}>
                <Close fill="#100F12" />
              </IconBox>
            </HeaderWrapper>
            <StepBar>
              <Step />
              <Step stepOne={stepOne} />
            </StepBar>
            {stepOne ? (
              <>
                <InputField
                  onKeyDown={handleEnter}
                  placeholder="Enter an email to share to"
                  onChange={(val) => setContactInput(val.target.value)}
                  autofocus={isOpen}
                  value={contactInput}
                  disabled={contactList.length >= 10}
                ></InputField>
                <HelperWrapper>
                  <MessageSubtitleText>
                    Press enter to add a contact
                  </MessageSubtitleText>
                </HelperWrapper>
              </>
            ) : (
              <>
                <MessageTitleWrapper>
                  <MessageTitleText>{shareMessageTitle}</MessageTitleText>
                  <MessageSubtitleText>
                    {shareMessageSubtitle}
                  </MessageSubtitleText>
                </MessageTitleWrapper>
                <TextAreaField
                  placeholder="Message"
                  onChange={(val) => setMessageInput(val.target.value)}
                  value={messageInput}
                />
              </>
            )}
          </TopWrapper>
          {stepOne && (
            <ContactListWrapper>
              {contactList.map((c, idx) => {
                return (
                  <ContactItem key={idx}>
                    <IconBox>
                      <ProfileImage />
                    </IconBox>
                    <ContactText>{c}</ContactText>
                    <IconBox onClick={() => updateContactList(c, "remove")}>
                      <Trash fill="#8B898E" />
                    </IconBox>
                  </ContactItem>
                );
              })}
            </ContactListWrapper>
          )}
          <div className={"ShareModal__Buttons"}>
            <Button
              disabled={stepOne && contactList.length === 0}
              size={IButtonSize.XLARGE}
              onClick={() => {
                stepOne ? setStepOne(false) : shareNow();
              }}
              mode={IButtonMode.PURPLE}
            >
              {stepOne ? "Next" : "Share Now"}
            </Button>
            <Button
              size={IButtonSize.XLARGE}
              onClick={onClose}
              mode={IButtonMode.GREY}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const SharedText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 111.111% */
  letter-spacing: -0.36px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const HeaderText = styled(SharedText)`
  flex: 1 0 0;
`;

const StepBar = styled.div`
  display: flex;
  height: 4px;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
`;
const Step = styled.div<{ stepOne?: boolean }>`
  flex: 1 0 0;
  align-self: stretch;
  background: ${(props) => (props.stepOne ? "#18141D34" : "#6c47ff")};
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  gap: 10px;
`;

const ContactText = styled.div`
  flex: 1 0 0;
  color: #18141d;
  font-feature-settings: "clig" off, "liga" off;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

const ContactListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  align-self: stretch;
  margin: 20px 0;
  gap: 10px;
`;

const FullButton = styled(Button)`
  width: 100%;
  padding: 20px;
`;

const NextButtonText = styled(SharedText)`
  color: #fff;
`;

const CancelButtonText = styled(SharedText)`
  opacity: 0.7;
`;

const MessageTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const MessageTitleText = styled(SharedText)`
  line-height: 24px;
`;

const MessageSubtitleText = styled(SharedText)`
  line-height: 24px;
  font-weight: 400;
  opacity: 0.7;
`;

const SuccessWrapper = styled.div`
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;

const CheckIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: #6c47ff;
  border-radius: 40px;
`;

const SuccessTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;

const SuccessTextMain = styled(SharedText)`
  display: flex;
  justify-content: center;
`;

const SuccessTextSub = styled(SharedText)`
  font-weight: 400;
  line-height: 24px;
  opacity: 0.7;
`;

const HelperWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
`;

export default ShareModal;
