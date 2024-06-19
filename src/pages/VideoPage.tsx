import React, { useState, useEffect, useRef, useContext } from "react";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import { getTagById, trackVideoProgress } from "../api/video";
import DefaultSpinner from "../components/DefaultSpinner";
import Tag from "../components/Tag";
import NotificationsEmpty from "../static/icons/NotificationsEmpty";
import Button, { IButtonMode } from "../components/Button";
import IconBox from "../components/IconBox";
import {
  addVideoToPlaylist,
  createPlaylist,
  getPlaylist,
} from "../api/playlist";
import {
  ApiPlaylist as Playlist,
  ApiFeaturedTag as FeaturedTag,
  ApiSeriesWithVideos as Series,
  ApiVideo as Video,
} from "../types/apiResponses";
import Share from "../static/icons/Share";
import Plus from "../static/icons/Plus";
import ListVideoCard from "../components/ListVideoCard";
import { getUpNextVideo } from "../lib/utils/videoUtils";
import useDelayUnmount from "../hooks/useDelayUnmount";
import ReusableModal from "../components/ReusableModal";
import Checkbox from "../components/Checkbox";
import InputField from "../components/InputField";
import ShareModal from "../components/ShareModal";
import Close from "../static/icons/Close";
import SearchSlideUp from "../components/SearchSlideUp";
import ArrowRight from "../static/icons/ArrowRight";
import NotificationsFull from "../static/icons/NotificationsFull";
import { MainContext } from "../contexts/MainContext";
import {
  fetchSubscriptions,
  handleSubscriptionToggle,
} from "../lib/utils/subscriptionUtils";
import { fetchPlaylists } from "../lib/utils/playlistUtils";
import { Types } from "../contexts/types";

import { classnames } from "../lib/utils/classnames";
import { Application } from "../store";
import "./styles/VideoPage.scss";
import { observer } from "mobx-react";
import { Icon, Icons, IconShape } from "../components/icon";
import { when } from "../lib/utils/when";

import ReactPlayer, { ReactPlayerProps } from "react-player";
import { getVideoUrl } from "../lib/data/Video";
import { colors } from "../styles/Colors";

export const VideoPage = observer(() => {
  const params = useParams();
  const id: string = params.id!;
  const [searchParams] = useSearchParams();
  const sourceType = searchParams.get("type");
  const typeLink = searchParams.get("source");
  const [didClickDetails, setDidClickDetails] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [nextVideoCountdown, setNextVideoCountdown] = useState(5);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [collection, setCollection] = useState<FeaturedTag | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlistsToAdd, setPlaylistsToAdd] = useState<Playlist[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [startTracking, setStartTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const addToPlaylistTransitionedIn = useDelayUnmount(isAddToPlaylistOpen, 420);
  const addPlaylistTransitionedIn = useDelayUnmount(isAddPlaylistOpen, 420);
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const [unwatchedVideoIdx, setUnwatchedVideoIdx] = useState<number | null>();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(MainContext);

  // const streamPlayerRef = useRef() as React.MutableRefObject<StreamPlayerApi>;
  const streamPlayerRef = useRef() as React.LegacyRef<ReactPlayer>;
  const isLoggedIn = Application.session.user.isAuthenticated;
  const handleOpenShare = () => {
    if (!isLoggedIn) {
      navigate("/auth");
    } else {
      setIsShareOpen(true);
    }
  };

  const handleAddToPlaylist = async () => {
    if (!Application.ui.video.current) return;
    if (!isLoggedIn) return;
    const videoId = Application.ui.video.current.id;
    try {
      playlistsToAdd.map(async (curPlaylist) => {
        const results = await addVideoToPlaylist(curPlaylist.id, videoId, 1);
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
          <AddToPlaylistButtonText>Save</AddToPlaylistButtonText>
        </FullButton>
      </AddToPlaylistModal>
    );
  };

  const handleCloseAddToPlaylist = () => {
    setPlaylistsToAdd([]);
    setIsAddToPlaylistOpen(false);
  };

  const handleCloseAddPlaylist = () => {
    setIsAddPlaylistOpen(false);
    setNewPlaylistName("");
  };

  const getNextVideo = () => {
    const video = Application.ui.video.current;
    if (!video) return;
    const series = Application.ui.video.currentSeries;
    if (playlist) {
      let curVidIdx = videos.findIndex((v) => v.id === video.id);
      let nextVidIdx = curVidIdx == videos.length - 1 ? 0 : curVidIdx + 1;
      return videos[nextVidIdx];
    } else if (collection) {
      let curVidIdx = videos.findIndex((v) => v.id === video.id);
      let nextVidIdx = curVidIdx == videos.length - 1 ? 0 : curVidIdx + 1;
      return videos[nextVidIdx];
    } else if (series) {
      let curVidIdx = series.videos.findIndex((v) => v.id === video.id);
      let nextVidIdx =
        curVidIdx == series.videos.length - 1 ? 0 : curVidIdx + 1;
      return series.videos[nextVidIdx];
    }
  };

  const handleNextVideo = () => {
    setVideoEnded(false);
    setNextVideoCountdown(5);
    const series = Application.ui.video.currentSeries;
    if (collection) {
      navigate({
        pathname: `/video/${getNextVideo()?.id}`,
        search: createSearchParams({
          type: "collection",
          source: `${collection.id}`,
        }).toString(),
      });
    } else if (playlist) {
      navigate({
        pathname: `/video/${getNextVideo()?.id}`,
        search: createSearchParams({
          type: "playlist",
          source: `${playlist.linkSlug}`,
        }).toString(),
      });
    } else if (series) {
      navigate({
        pathname: `/video/${getNextVideo()?.id}`,
        search: createSearchParams({
          type: "series",
          source: `${series.id}`,
        }).toString(),
      });
    }
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
            mode={IButtonMode.PRIMARY}
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

  const renderShareModal = () => {
    if (!Application.ui.video.current) return;
    return (
      <ShareModal
        item={Application.ui.video.current}
        isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
        onClose={() => setIsShareOpen(false)}
      />
    );
  };

  const handleProgress = (progress: ReactPlayerProps["OnProgressProps"]) => {
    if (!Application.ui.video.current) return;
    if (!startTracking) return;
    const videoId = Application.ui.video.current.id;
    if (state.user) {
      trackVideoProgress(videoId, progress.playedSeconds);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setStartTracking(false);
  };

  const renderStream = () => {
    if (!Application.ui.video.current) return;
    const video = Application.ui.video.current;
    const series = Application.ui.video.currentSeries;
    return (
      <div className={"VideoPage__Stream"}>
        {isLoadingVideo && (
          <div className={classnames("VideoPage__Spinner")}>
            <DefaultSpinner />
          </div>
        )}
        <div className={"VideoPage__Stream__Container"}>
          {!videoEnded || !(playlist || series || collection) ? (
            <ReactPlayer
              controls
              ref={streamPlayerRef}
              url={getVideoUrl(video.videoId)}
              onReady={() => setIsLoadingVideo(false)}
              width="100%"
              height="700px"
              playsinline={true}
              onProgress={handleProgress}
              progressInterval={10000}
              onPlay={() => {
                setStartTracking(true);
                setIsPaused(false);
              }}
              onPause={() => setStartTracking(false)}
              onEnded={() => handleVideoEnd()}
            />
          ) : (
            <div className={"VideoPage__Stream__Ended"}>
              <h2>
                Playing
                <div className={"VideoPage__Stream__Ended__VideoText"}>
                  "{getNextVideo()?.title}"
                </div>
                in {nextVideoCountdown}s
              </h2>

              <DefaultSpinner />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVideoList = () => {
    if (!Application.ui.video.current) return;
    const video = Application.ui.video.current;
    const series = Application.ui.video.currentSeries;
    const upNextVideoId = Application.ui.video.upNextVideoId;
    return (
      <div className={"VideoPage__List"}>
        {series
          ? series.videos.map((v: Video, idx) => {
              return (
                <ListVideoCard
                  key={idx}
                  video={v}
                  isActive={video.id === v.id}
                  status={v.isWatched ? "watched" : ""}
                  isUpNext={upNextVideoId === v.id}
                  series={series}
                  actionMenu={false}
                />
              );
            })
          : playlist
          ? videos.map((v: Video, idx) => {
              return (
                <ListVideoCard
                  key={idx}
                  video={v}
                  isActive={video.id === v.id}
                  status={v.isWatched ? "watched" : ""}
                  isUpNext={upNextVideoId === v.id}
                  playlist={playlist}
                  actionMenu={false}
                />
              );
            })
          : collection
          ? videos.map((v: Video, idx) => {
              return (
                <ListVideoCard
                  key={idx}
                  video={v}
                  isActive={video.id === v.id}
                  status={v.isWatched ? "watched" : ""}
                  isUpNext={upNextVideoId === v.id}
                  collection={collection}
                  actionMenu={false}
                />
              );
            })
          : null}
      </div>
    );
  };

  const renderPlaylistOrSeries = () => {
    if (!Application.ui.video.current) return;
    const video = Application.ui.video.current;
    const series = Application.ui.video.currentSeries;
    const subscriptions = Application.ui.subscription.all;
    const subscribed =
      subscriptions && subscriptions.some((s) => s.id === series?.id);
    return (
      <div className={"VideoPage__Content"}>
        <div className={"VideoPage__VideoDetails"}>
          <div className={"VideoPage__TitleTop"}>
            <div className={"VideoPage__TitleTopRow"}>
              <h2>{video.title}</h2>
              <Button onClick={() => handleNextVideo()} mode={IButtonMode.GREY}>
                <Icon provider={Icons} shape={IconShape.PLAY} size={20} />
                Next Video
              </Button>
            </div>
            <div
              className={"VideoPage__VideoDetails__Button"}
              onClick={() => setDidClickDetails(true)}
            >
              Details
            </div>
            <div>{video.description}</div>
            <div className={"VideoPage__Tags"}>
              {video.tags.map((tag, idx) => (
                <Tag
                  key={idx}
                  text={tag.name}
                  onClick={() => navigate(`/featured/${tag.id}`)}
                ></Tag>
              ))}
            </div>
          </div>
        </div>
        <div className="VideoPage__Series">
          <div className={"VideoPage__Controls"}>
            {(series || playlist || collection) && (
              <h2>
                {series
                  ? series.name
                  : playlist
                  ? playlist.name
                  : collection
                  ? collection.name
                  : ""}
              </h2>
            )}
            <div className={"VideoPage__Controls__Buttons"}>
              <Button
                onClick={() => handleOpenShare()}
                mode={IButtonMode.GREY}
                disabled={!isLoggedIn}
              >
                <Icon provider={Icons} shape={IconShape.SHARE} size={20} />
                Share
              </Button>
              <Button
                onClick={() => setIsAddToPlaylistOpen(true)}
                mode={IButtonMode.GREY}
                disabled={!isLoggedIn}
              >
                <Icon
                  provider={Icons}
                  shape={IconShape.FILE_DOWNLOAD}
                  size={20}
                />
                Save
              </Button>
              {when(
                series,
                <Button
                  onClick={() => {
                    if (!series) return;
                    Application.ui.subscription.toggleSubscription(series.id);
                  }}
                  mode={IButtonMode.GREY}
                  disabled={!isLoggedIn}
                >
                  <Icon
                    provider={Icons}
                    shape={
                      subscribed ? IconShape.ALERT_FULL : IconShape.ALERT_EMPTY
                    }
                    size={20}
                  />
                  Subscribe
                </Button>
              )}
            </div>
          </div>
          {(series || playlist || collection) && renderVideoList()}
        </div>
      </div>
    );
  };

  const handleMoreSpeaker = () => {
    setIsSearchOpen(true);
  };

  const renderDetails = () => {
    if (!Application.ui.video.current) return;
    const series = Application.ui.video.currentSeries;
    const video = Application.ui.video.current;
    return (
      <DetailsWrapper className={classnames("VideoPage__Details")}>
        <DetailsTitleWrapper>
          <DetailsTitle>Details</DetailsTitle>
          <IconBox onClick={() => setDidClickDetails(false)}>
            <Close fill="#8B898E" />
          </IconBox>
        </DetailsTitleWrapper>
        <DetailsContentWrapper>
          <DetailsContentInnerWrapper>
            <h2>{video?.title}</h2>
            <div className={"VideoPage__Tags"}>
              {video.tags.map((tag, idx) => (
                <Tag
                  key={idx}
                  text={tag.name}
                  onClick={() => navigate(`featured/${tag.id}`)}
                ></Tag>
              ))}
            </div>
            <DetailsVideoContentWrapper>
              {series?.speakers.length ? (
                <PeopleWrapper>
                  <AuthorsWrapper>
                    <Author>
                      <AuthorPhoto
                        src={
                          series.speakers.length
                            ? series.speakers[0].ThumbnailUrl
                            : ""
                        }
                      ></AuthorPhoto>
                      <SpeakerInfo>
                        <SpeakerInfoTitle>Series Speaker</SpeakerInfoTitle>
                        <SpeakerInfoName>
                          <SpeakerName>
                            {series.speakers.length
                              ? series.speakers[0].name
                              : ""}
                          </SpeakerName>
                          <SpeakerDescription>
                            {series.speakers.length
                              ? series.speakers[0].bio
                              : ""}
                          </SpeakerDescription>
                        </SpeakerInfoName>
                        <MoreInfoWrapper onClick={() => handleMoreSpeaker()}>
                          <MoreSpeakerInfo>
                            More from this speaker
                          </MoreSpeakerInfo>
                          <IconBox>
                            <ArrowRight />
                          </IconBox>
                        </MoreInfoWrapper>{" "}
                      </SpeakerInfo>
                    </Author>
                  </AuthorsWrapper>
                </PeopleWrapper>
              ) : (
                <></>
              )}
              <DetailsVideoDescription>
                {video?.description}
              </DetailsVideoDescription>
            </DetailsVideoContentWrapper>
          </DetailsContentInnerWrapper>
        </DetailsContentWrapper>
      </DetailsWrapper>
    );
  };

  // Load the video passed by the URL
  if (id) {
    Application.ui.video.getVideoById(id);
  }

  // Load video when id changes
  useEffect(() => {
    if (!id) return;
    Application.ui.video.getVideoById(id);
  }, [id]);

  useEffect(() => {
    if (videoEnded) {
      nextVideoCountdown > 0
        ? setTimeout(() => setNextVideoCountdown(nextVideoCountdown - 1), 1000)
        : handleNextVideo();
    }
  }, [videoEnded, nextVideoCountdown]);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (state.user && !state.playlists) {
        await fetchPlaylists(dispatch);
      }
    };

    const getCollection = async (id: string) => {
      try {
        const collectionData = await getTagById(id);
        setCollection(collectionData);
        setVideos(collectionData.videos);
        setUnwatchedVideoIdx(getUpNextVideo(collectionData.videos));
      } catch (e) {
        console.log("Failed to fetch collection", e);
      }
    };

    const fetchPlaylist = async (id: string) => {
      try {
        const playlistData = await getPlaylist(id);
        if (playlistData) {
          setPlaylist(playlistData.playlist);
          setVideos(playlistData.videos);
          setUnwatchedVideoIdx(getUpNextVideo(playlistData.videos));
        }
      } catch (e) {
        console.log("Failed to fetch playlist", e);
      }
    };

    fetchUserPlaylists();
    if (!typeLink) return;
    if (sourceType === "series") {
      Application.ui.video.getSeriesById(parseInt(typeLink));
    } else if (sourceType === "playlist") {
      fetchPlaylist(typeLink!);
    } else if (sourceType === "collection") {
      getCollection(typeLink!);
    }
  }, [sourceType, typeLink]);

  useEffect(() => {
    if (state.user && !state.subscriptions) {
      fetchSubscriptions(dispatch);
    }
  }, [fetchSubscriptions]);

  // Was trying to pass series?.speakers[0].name into the search query

  return (
    <div className={classnames("VideoPage")}>
      {renderStream()}
      {didClickDetails === false ? renderPlaylistOrSeries() : renderDetails()}

      {(isAddToPlaylistOpen || addToPlaylistTransitionedIn) &&
        renderAddToPlaylistModal()}
      {when(shareTransitionedIn || isShareOpen, renderShareModal())}
      {(isAddPlaylistOpen || addPlaylistTransitionedIn) &&
        renderAddPlaylistModal()}
      <SearchSlideUp
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
});

export default VideoPage;

const SharedText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 166.667% */
  letter-spacing: -0.36px;
`;

const SharedSubtitle = styled(SharedText)`
  color: #000;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px; /* 150% */
  letter-spacing: unset;
`;

const SeriesOrPlaylistName = styled(SharedText)`
  font-size: 12px;
  line-height: 20px; /* 166.667% */
  letter-spacing: -0.24px;
  flex: 1 0 0;
`;

const ButtonText = styled(SeriesOrPlaylistName)`
  flex: unset;
  opacity: 0.7;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const PlaylistOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  overflow-y: auto;
  max-height: 300px;
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

  & :hover {
    * > svg path {
      fill: #fff;
    }
  }
`;
const CreateText = styled(OptionText)`
  color: var(--Dark, #18141d);
  line-height: 20px; /* 111.111% */
  letter-spacing: unset;
  ${CreateButton}:hover & {
    color: ${colors.white};
  }
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

const FullButton = styled(Button)`
  width: 100%;
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

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  align-self: stretch;
`;

const DetailsTitleWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  justify-content: flex-end;
  align-items: center;
  align-self: stretch;
`;

const DetailsTitle = styled(SharedText)`
  flex: 1 0 0;
`;

const DetailsContentWrapper = styled.div`
  display: flex;
  padding: 11px 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  border-top: 1px solid #8b898e;
`;

const DetailsContentInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const DetailsVideoContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const PeopleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const AuthorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const Author = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  background: rgba(24, 20, 29, 0.1);
`;

const AuthorPhoto = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 100%;
`;

const SpeakerInfo = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const SpeakerInfoTitle = styled(SharedText)`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  align-self: stretch;
  font-size: 14px;
  line-height: 20px; /* 142.857% */
  letter-spacing: 1.4px;
  opacity: 0.5;
`;

const SpeakerInfoName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const SpeakerName = styled(SharedText)`
  font-size: 24px;
  line-height: 140%; /* 33.6px */
  letter-spacing: -0.48px;
  align-self: stretch;
`;

const SpeakerDescription = styled(SharedSubtitle)`
  font-weight: 400;
  line-height: 20px; /* 111.111% */
  align-self: stretch;
`;

const MoreInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const MoreSpeakerInfo = styled(SharedText)`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const DetailsVideoDescription = styled(SharedText)`
  font-weight: 400;
  letter-spacing: unset;
  align-self: stretch;
`;

const AddToPlaylistButtonText = styled(ButtonText)`
  color: #fff;
  opacity: unset;
`;

const CancelButtonText = styled(ModalButtonText)`
  ${CancelButton}:hover & {
    color: ${colors.white};
  }
`;
