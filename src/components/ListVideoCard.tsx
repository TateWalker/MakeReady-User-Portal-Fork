import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  ApiVideo as Video,
  ApiFeaturedTag as FeaturedTag,
  ApiPlaylist as Playlist,
  ApiSeriesWithVideos as Series,
} from "../types/apiResponses";
import { videoDurationToTime } from "../lib/utils/videoUtils";
import StatusLabel from "./StatusLabel";
import { useNavigate } from "react-router";
import IconBox from "./IconBox";
import DotMenu from "../static/icons/DotMenu";
import Play from "../static/icons/Play";
import Tooltip from "./Tooltip";
import VideoShareTooltip from "./VideoShareTooltip";
import fallbackThumbnail from "../static/images/thumbnail404-sm.jpg";
import { ArrowContainer, Popover } from "react-tiny-popover";
import ReusableModal from "./ReusableModal";
import useDelayUnmount from "../hooks/useDelayUnmount";
import {
  addVideoToPlaylist,
  createPlaylist,
  getMyPlaylists,
  removeVideoFromPlaylist,
} from "../api/playlist";
import Checkbox from "./Checkbox";
import Plus from "../static/icons/Plus";
import Button, { IButtonMode } from "./Button";
import ShareModal from "./ShareModal";
import InputField from "./InputField";
import { createSearchParams } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { MainContext } from "../contexts/MainContext";

import "./styles/ListVideoCard.scss";
import { classnames } from "../lib/utils/classnames";
import { Application } from "../store";
import { Icon, IconShape, Icons } from "./icon";
import { colors } from "../styles/Colors";

interface IProps {
  video: Video;
  status?: string;
  onAction?: () => void;
  onClick?: () => void;
  isActive?: boolean;
  isUpNext?: boolean;
  playlist?: Playlist;
  collection?: FeaturedTag;
  series?: Series;
  userPlaylists?: Playlist[];
  actionMenu?: boolean;
}

export default function ListVideoCard(props: IProps) {
  const {
    video,
    status,
    onAction,
    onClick,
    isActive = false,
    isUpNext = false,
    collection,
    playlist,
    userPlaylists,
    series,
    actionMenu,
  } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [playlistsToAdd, setPlaylistsToAdd] = useState<Playlist[]>([]);
  const addToPlaylistTransitionedIn = useDelayUnmount(isAddToPlaylistOpen, 420);
  const addPlaylistTransitionedIn = useDelayUnmount(isAddPlaylistOpen, 420);
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const navigate = useNavigate();
  const isLoggedIn = Application.session.user.isAuthenticated;

  const handleVideoNav = (id: number) => {
    Application.ui.menu.close();
    Application.ui.search.close();
    if (series) {
      navigate({
        pathname: `/video/${id}`,
        search: createSearchParams({
          type: "series",
          source: `${series.id}`,
        }).toString(),
      });
    } else if (playlist) {
      navigate({
        pathname: `/video/${id}`,
        search: createSearchParams({
          type: "playlist",
          source: `${playlist.linkSlug}`,
        }).toString(),
      });
    } else if (collection) {
      navigate({
        pathname: `/video/${id}`,
        search: createSearchParams({
          type: "collection",
          source: `${collection.id}`,
        }).toString(),
      });
    } else {
      // Navigate to URL
      navigate({
        pathname: `/video/${id}`,
      });
    }
  };

  const handleCloseAddToPlaylist = () => {
    setPlaylistsToAdd([]);
    setIsAddToPlaylistOpen(false);
  };

  const handleAddToPlaylist = async () => {
    if (!video) return;
    if (!isLoggedIn) return;
    try {
      playlistsToAdd.map(async (curPlaylist) => {
        const results = await addVideoToPlaylist(curPlaylist.id, video.id, 1);
        if (results) {
          Application.ui.playlist.loadPlaylists();
          console.log("Video added to playlist");
        } else {
          console.log("Failed to add video to playlist");
        }
      });
      setIsAddToPlaylistOpen(false);
    } catch (e) {
      console.log("Failed to add videos to playlists");
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

  const deleteFromPlaylist = async () => {
    console.log("Deleting from playlist");
    if (!isLoggedIn) return;
    try {
      const result = await removeVideoFromPlaylist(playlist!.id, video.id);
      if (result) {
        window.location.reload();
      }
    } catch (e) {
      console.log("Failed to delete video from playlist", e);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      if (isLoggedIn && Application.ui.playlist.all) {
        try {
          Application.ui.playlist.create(newPlaylistName);
          setIsAddPlaylistOpen(false);
          setNewPlaylistName("");
          Application.ui.playlist.loadPlaylists();
        } catch (e) {
          console.log("Failed to create playlist", e);
        }
      }
    } catch (e) {
      console.log("Failed to create playlist", e);
      setIsAddPlaylistOpen(false);
      setNewPlaylistName("");
    }
  };

  const handleSetAllPlaylistsToAdd = (
    playlist: Playlist,
    isChecked: boolean
  ) => {
    if (isChecked === true) {
      setPlaylistsToAdd([...playlistsToAdd, playlist]);
    } else {
      setPlaylistsToAdd(
        playlistsToAdd.filter((curPlaylist) => curPlaylist.id !== playlist.id)
      );
    }
  };

  const handleCloseAddPlaylist = () => {
    setIsAddPlaylistOpen(false);
    setNewPlaylistName("");
  };

  const renderAddPlaylistModal = () => {
    return (
      <ReusableModal
        isOpen={
          addPlaylistTransitionedIn
            ? isAddPlaylistOpen
            : addPlaylistTransitionedIn
        }
        onClose={() => {
          handleCloseAddPlaylist();
        }}
        title="Create a new playlist"
      >
        <InputField
          placeholder="Playlist Name"
          value={newPlaylistName}
          onChange={(e) => {
            setNewPlaylistName(e.target.value);
          }}
        ></InputField>
        <CreatePlaylistModalButtonWrapper>
          <CancelButton
            color="#18141D1A"
            onClick={() => handleCloseAddPlaylist()}
          >
            <CancelButtonText>Cancel</CancelButtonText>
          </CancelButton>
          <ConfirmButton
            mode={IButtonMode.PURPLE}
            onClick={() => {
              handleCreatePlaylist();
            }}
          >
            <ConfirmButtonText>Confirm</ConfirmButtonText>
          </ConfirmButton>
        </CreatePlaylistModalButtonWrapper>
      </ReusableModal>
    );
  };

  const renderAddToPlaylistModal = () => {
    return (
      <AddToPlaylistModal
        isOpen={
          addToPlaylistTransitionedIn
            ? isAddToPlaylistOpen
            : addToPlaylistTransitionedIn
        }
        onClose={() => {
          handleCloseAddToPlaylist();
        }}
        title="Save to playlist"
      >
        <ContentWrapper>
          <PlaylistOptionsWrapper>
            {Application.ui.playlist.all &&
              Application.ui.playlist.all.map((curPlaylist, idx) => {
                return (
                  <PlaylistOption key={idx}>
                    <Checkbox
                      checked={false}
                      onChange={(isChecked: boolean) => {
                        handleSetAllPlaylistsToAdd(curPlaylist, isChecked);
                      }}
                    />
                    <OptionText>{curPlaylist.name}</OptionText>
                  </PlaylistOption>
                );
              })}
          </PlaylistOptionsWrapper>
          <CreateButton
            color="transparent"
            onClick={() => setIsAddPlaylistOpen(true)}
          >
            <Icon provider={Icons} shape={IconShape.ADD} height={24} />
            <CreateText>Create new playlist</CreateText>
          </CreateButton>
        </ContentWrapper>
        <FullButton
          mode={IButtonMode.PURPLE}
          onClick={() => handleAddToPlaylist()}
        >
          <ButtonText>Save</ButtonText>
        </FullButton>
      </AddToPlaylistModal>
    );
  };

  const renderShareModal = () => {
    return (
      <ShareModal
        item={video}
        isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
        onClose={() => setIsShareOpen(false)}
      />
    );
  };

  const getVideoPercentage = () => {
    return (
      ((video.videoProgressSeconds / video.duration) * 100).toString() + "%"
    );
  };

  useEffect(() => {
    if (isAddToPlaylistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isAddToPlaylistOpen]);

  useEffect(() => {
    setAllPlaylists(userPlaylists!);
  }, [userPlaylists]);

  return (
    <div
      className={classnames(
        "ListVideoCard",
        isActive ? "ListVideoCard--selected" : "",
        isUpNext ? "ListVideoCard--next" : ""
      )}
      key={video.id}
    >
      <Thumbnail
        image={video.ThumbnailFile ? video.ThumbnailUrl : fallbackThumbnail}
        onClick={() => handleVideoNav(video.id)}
      >
        <ThumbnailHover>
          <ThumbnailPlay size="50px">
            <Play fill="#fff" />
          </ThumbnailPlay>
        </ThumbnailHover>
        <ProgressBar color="#FF3A69" percentage={getVideoPercentage()} />
      </Thumbnail>
      <VideoRight>
        <VideoDetails onClick={() => handleVideoNav(video.id)}>
          <VideoTitle>{video.title}</VideoTitle>
          <VideoInfo>
            <VideoDuration>{videoDurationToTime(video.duration)}</VideoDuration>
            {(status || isUpNext) && (
              <StatusLabel
                color={isUpNext ? "purple" : "muted"}
                status={isUpNext ? "up next" : status}
              />
            )}
          </VideoInfo>
          <VideoDescription>{video.description}</VideoDescription>
        </VideoDetails>
        {actionMenu !== false && isLoggedIn === true && (
          <DotMenuWrapper>
            <Popover
              isOpen={showTooltip}
              positions={["bottom", "left"]}
              align="start"
              onClickOutside={() => setShowTooltip(false)}
              containerStyle={{ zIndex: "1000" }}
              content={({ position, childRect, popoverRect }) => (
                <ArrowContainer
                  position={position}
                  childRect={childRect}
                  popoverRect={popoverRect}
                  arrowColor={"#fff"}
                  arrowSize={8}
                >
                  <Tooltip>
                    <VideoShareTooltip
                      video={video}
                      playlist={playlist!}
                      onAddToPlaylistOpen={() => {
                        setIsAddToPlaylistOpen(true);
                        setShowTooltip(false);
                      }}
                      onDeleteFromPlaylist={() => {
                        deleteFromPlaylist();
                        setShowTooltip(false);
                      }}
                      onShareModalOpen={() => {
                        handleOpenShare();
                        setShowTooltip(false);
                      }}
                    />
                  </Tooltip>
                </ArrowContainer>
              )}
            >
              <div>
                <IconBox onClick={() => setShowTooltip(!showTooltip)}>
                  <DotMenu fill="#100F12" />
                </IconBox>
              </div>
            </Popover>
          </DotMenuWrapper>
        )}
      </VideoRight>
      {(isAddToPlaylistOpen || addToPlaylistTransitionedIn) &&
        renderAddToPlaylistModal()}
      {(shareTransitionedIn || isShareOpen) && renderShareModal()}
      {(isAddPlaylistOpen || addPlaylistTransitionedIn) &&
        renderAddPlaylistModal()}
    </div>
  );
}

const Thumbnail = styled.div<{ image: string }>`
  position: relative;
  display: flex;
  height: 140px;
  width: 75px;
  flex-shrink: 0;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-repeat: no-repeat;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ThumbnailHover = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: rgba(108, 71, 255, 0.5);
  mix-blend-mode: normal;
  ${Thumbnail}:hover & {
    opacity: 1;
    & > :first-child {
      opacity: 1;
    }
  }
`;

const ThumbnailPlay = styled(IconBox)`
  opacity: 0;
`;

const VideoRight = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
`;

const VideoDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  cursor: pointer;
`;

const VideoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SharedText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;

const VideoTitle = styled(SharedText)`
  text-transform: capitalize;
`;

const VideoDuration = styled(SharedText)`
  color: #6c47ff;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const VideoDescription = styled(SharedText)`
  flex: 1 0 0;
  align-self: stretch;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
`;

const DotMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;
  position: relative;
  align-items: center;
`;

///
const FullButton = styled(Button)`
  width: 100%;
`;

const ButtonText = styled.div`
  color: #fff;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;

const PlaylistOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  overflow-y: auto;
`;
const OptionText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;

const CreateButton = styled(Button)`
  padding: 0;
`;

const CreateText = styled(OptionText)`
  color: ${colors.black};
  line-height: 20px; /* 111.111% */
  letter-spacing: unset;
  ${CreateButton}:hover & {
    color: ${colors.white};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const PlaylistOption = styled.div`
  display: flex;
  padding: 10px 0px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  display: flex;
  flex: 1 0 0;
`;

const CreatePlaylistModalButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

const CancelButton = styled(Button)`
  flex: 1 0 0;
`;

const ConfirmButton = styled(CancelButton)``;

const ModalButtonText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;

const ConfirmButtonText = styled(ModalButtonText)`
  color: #fff;
`;

const AddToPlaylistModal = styled(ReusableModal)`
  gap: 20px;
`;

const CancelButtonText = styled(ModalButtonText)`
  color: ${colors.black};
  ${CancelButton}:hover & {
    color: ${colors.white};
  }
`;
