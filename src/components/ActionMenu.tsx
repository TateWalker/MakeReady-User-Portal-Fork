import React, { useEffect, useState } from "react";
import useDelayUnmount from "../hooks/useDelayUnmount";
import styled from "styled-components";
import {
  ApiVideo as Video,
  ApiPlaylist as Playlist,
  ApiSeries as Series,
  ApiFeaturedTag as FeaturedTag,
} from "../types/apiResponses";
import { deletePlaylist, renamePlaylist } from "../api/playlist";
import Close from "../static/icons/Close";
import IconBox from "./IconBox";
import Button, { IButtonMode } from "./Button";
import Share from "../static/icons/Share";
import Edit from "../static/icons/Edit";
import Trash from "../static/icons/Trash";
import ShareModal from "./ShareModal";
import ReusableModal from "./ReusableModal";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Application } from "../store";
import { colors } from "../styles/Colors";
import { Icon, IconShape, Icons } from "./icon";

interface IProps {
  item: Video | Playlist | Series | FeaturedTag | null;
  isOpen: boolean;
  onClose: () => void;
}
const ActionMenu = observer(({ ...props }) => {
  const { item, isOpen, onClose } = props;
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [title, setTitle] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const renameTransitionedIn = useDelayUnmount(isRenameOpen, 420);
  const deleteTransitionedIn = useDelayUnmount(isDeleteOpen, 420);
  // TODO remove rename and delete if item == series

  useEffect(() => {
    if (item) {
      if ("name" in item) {
        setTitle(item.name);
      } else {
        setTitle(item?.title);
      }
    }
  }, [item]);

  useEffect(() => {
    if (!accessToken) {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        setAccessToken(JSON.parse(access_token).token);
      }
    }
  }, []);

  const handleRenamePlaylist = async () => {
    try {
      if (accessToken) {
        const response = await renamePlaylist(
          accessToken,
          item!.id,
          newPlaylistName
        );
        if (response === true) {
          Application.ui.playlist.loadPlaylists();
          Application.ui.playlist.selected!.name = newPlaylistName;
          setIsRenameOpen(false);
          setTitle(newPlaylistName);
          setNewPlaylistName("");
        }
      }
    } catch (e) {
      console.log("Failed to rename playlist", e);
      setIsRenameOpen(false);
      setNewPlaylistName("");
    }
  };

  const handleOpenShare = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/auth");
    } else {
      setIsShareOpen(true);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      if (accessToken) {
        try {
          Application.ui.playlist.deletePlaylist(item!.id);
          setIsDeleteOpen(false);
          navigate(-1);
          onClose();
        } catch (e) {
          console.log("Failed to delete playlist", e);
        }
      }
    } catch (e) {
      console.log("Failed to delete playlist", e);
      setIsDeleteOpen(false);
    }
  };

  const handleCloseRenameModal = () => {
    setNewPlaylistName("");
    setIsRenameOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, isShareOpen]);

  const renderShareModal = () => {
    return (
      <ShareModal
        item={item}
        isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
        onClose={() => setIsShareOpen(false)}
      />
    );
  };

  return (
    <Wrapper isOpen={isOpen}>
      <Top>
        <IconBox onClick={() => onClose()}>
          <Close fill="#FFF" />
        </IconBox>
        <TitleWrapper>{title}</TitleWrapper>
      </Top>
      <Bottom>
        <FullButton color="#FFF" onClick={() => handleOpenShare()}>
          <Icon provider={Icons} shape={IconShape.SHARE} size={24} />
          <ButtonText>Share</ButtonText>
        </FullButton>
        <FullButton color="#FFF" onClick={() => setIsRenameOpen(true)}>
          <Icon provider={Icons} shape={IconShape.EDIT} size={20} />
          <ButtonText>Rename</ButtonText>
        </FullButton>
        <FullButton color="#FFF" onClick={() => setIsDeleteOpen(true)}>
          <Icon provider={Icons} shape={IconShape.DELETE} size={20} />
          <ButtonText>Delete Playlist</ButtonText>
        </FullButton>
      </Bottom>
      {(renameTransitionedIn || isRenameOpen) && (
        <ReusableModal
          title="Rename Playlist"
          isOpen={renameTransitionedIn ? isRenameOpen : renameTransitionedIn}
          onClose={() => handleCloseRenameModal()}
        >
          <InputField
            placeholder={"New playlist name"}
            onChange={(e) => {
              setNewPlaylistName(e.target.value);
            }}
            value={newPlaylistName}
          />
          <RenameModalButtonWrapper>
            <CancelButton
              color="#18141D1A"
              onClick={() => handleCloseRenameModal()}
            >
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <ConfirmButton
              mode={IButtonMode.PURPLE}
              onClick={() => {
                handleRenamePlaylist();
              }}
            >
              <ConfirmButtonText>Confirm</ConfirmButtonText>
            </ConfirmButton>
          </RenameModalButtonWrapper>
        </ReusableModal>
      )}
      {(deleteTransitionedIn || isDeleteOpen) && (
        <ReusableModal
          title="Delete Playlist"
          isOpen={deleteTransitionedIn ? isDeleteOpen : deleteTransitionedIn}
          onClose={() => setIsDeleteOpen(false)}
        >
          <ConfirmationText>{`Are you sure you want to delete \n"${title}"`}</ConfirmationText>
          <RenameModalButtonWrapper>
            <CancelButton
              color="#18141D1A"
              onClick={() => setIsDeleteOpen(false)}
            >
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <ConfirmButton
              mode={IButtonMode.PURPLE}
              onClick={() => {
                handleDeletePlaylist();
              }}
            >
              <ConfirmButtonText>Confirm</ConfirmButtonText>
            </ConfirmButton>
          </RenameModalButtonWrapper>
        </ReusableModal>
      )}
      {(shareTransitionedIn || isShareOpen) && renderShareModal()}
    </Wrapper>
  );
});

const Wrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  background: rgba(16, 15, 18, 0.9);
  backdrop-filter: blur(20px);
  overflow: hidden;
  left: 0;
  right: 0;
  height: 100%;
  top: ${(props) => (props.isOpen ? "0" : "100vh")};
  height: ${(props) => (props.isOpen ? "100%" : "0")};
  transition-property: height, top;
  transition-delay: ${(props) => (props.isOpen ? "0s" : ".42s, 0s")};
  transition-duration: 0.01s, 0.42s;
  transition-timing-function: ease-out;
  z-index: 1000;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  padding: 20px;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  padding: 20px;
`;

const SharedText = styled.div`
  color: #fff;
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 133.333% */
  letter-spacing: -0.36px;
`;

const TitleWrapper = styled(SharedText)`
  align-self: stretch;
  text-transform: capitalize;
`;

const ButtonText = styled(SharedText)`
  color: #18141d;
  font-size: 14px;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;

const FullButton = styled(Button)`
  width: 100%;
  &:hover {
    svg path {
      fill: #fff;
    }
    :nth-child(2) {
      color: #fff;
    }
  }
`;

const RenameModalButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

const CancelButton = styled(Button)`
  flex: 1 0 0;
`;

const ConfirmButton = styled(CancelButton)``;

const ConfirmButtonText = styled(ButtonText)`
  color: #fff;
`;

const ConfirmationText = styled(SharedText)`
  color: #000;
  text-align: center;
  font-size: 14px;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
  white-space: pre-line;
`;

const CancelButtonText = styled(ButtonText)`
  ${CancelButton}:hover & {
    color: ${colors.white};
  }
`;

export default ActionMenu;
