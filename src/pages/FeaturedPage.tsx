import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  ApiFeaturedTag as FeaturedTag,
  ApiVideo as Video,
  ApiPlaylist as Playlist,
} from "../types/apiResponses";
import Button, { IButtonMode, IButtonSize } from "../components/Button";
import SearchBar from "../components/SearchBar";
import ListVideoCard from "../components/ListVideoCard";
import ActionMenu from "../components/ActionMenu";
import { getUpNextVideo } from "../lib/utils/videoUtils";
import useDelayUnmount from "../hooks/useDelayUnmount";
import ShareModal from "../components/ShareModal";
import DefaultSpinner from "../components/DefaultSpinner";
import { Icon, IconShape, Icons } from "../components/icon";
import { getTagById } from "../api/video";
import { media } from "../styles/media";

export default function FeaturedPage() {
  const params = useParams();
  const featuredTagId: string = params.id!;
  const [collection, setCollection] = useState<FeaturedTag | null>(null);
  const [videos, setVideos] = useState<Video[] | []>([]);
  const [selectedItem, setSelectedItem] = useState<Video | FeaturedTag | null>(
    null
  );
  const [unwatchedVideoIdx, setUnwatchedVideoIdx] = useState<number | null>();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState<Video[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleActionToggle = (item: Video | FeaturedTag | null) => {
    setSelectedItem(item);
    setIsActionOpen(true);
  };

  const handleActionClose = () => {
    setIsActionOpen(false);
  };

  const handleOpenShare = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/auth");
    } else {
      setIsShareOpen(true);
    }
  };

  const fetchData = async () => {
    try {
      const collectionData = await getTagById(featuredTagId);
      setCollection(collectionData);
      setVideos(collectionData.videos);
      setFilteredVideos(collectionData.videos);
      setIsLoading(false);
    } catch (e) {
      console.log("Failed to fetch collection", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setUnwatchedVideoIdx(getUpNextVideo(videos));
  }, [videos]);

  return (
    <Wrapper isActionOpen={isActionOpen}>
      <FeaturedHeader>
        <PlaylistTitle>{collection?.name}</PlaylistTitle>
        <PlaylistLowerTextWrapper>
          <SharedText>{filteredVideos?.length}</SharedText>
          <SharedTextLight>
            {filteredVideos?.length !== 1 ? "Videos" : "Video"}
          </SharedTextLight>
        </PlaylistLowerTextWrapper>
        <PlaylistLowerButtonWrapper>
          <Button
            mode={IButtonMode.PRIMARY}
            onClick={() =>
              navigate({
                pathname: `/video/${videos[0].id}`,
                search: createSearchParams({
                  type: "tag",
                  source: `${featuredTagId}`,
                }).toString(),
              })
            }
          >
            <Icon provider={Icons} shape={IconShape.PLAY} size={16} />
            Start Watching
          </Button>
          <Button
            className={"ShareButton"}
            mode={IButtonMode.ICON}
            size={IButtonSize.LARGE}
            onClick={() => handleOpenShare()}
            iconShape={IconShape.SHARE}
          />
          {/* <Button
            className={"ShareButton"}
            mode={IButtonMode.ICON}
            size={IButtonSize.LARGE}
            iconShape={
              state.subscriptions &&
              state.subscriptions.some((s) => s.id === series.id)
                ? IconShape.ALERT_FULL
                : IconShape.ALERT_EMPTY
            }
            iconShape={IconShape.ALERT_EMPTY}
          /> */}
        </PlaylistLowerButtonWrapper>
      </FeaturedHeader>
      {isLoading ? (
        <SpinnerWrapper>
          <DefaultSpinner isDark={true} />
        </SpinnerWrapper>
      ) : (
        <PlaylistPageContent>
          <SearchBar
            videoList={videos}
            placeholder="Filter videos by title, description"
            setVideoResults={(returnedVideos: Video[]) => {
              setFilteredVideos(returnedVideos);
            }}
            isSearching={(isSearching: boolean) => {
              setIsSearching(isSearching);
            }}
          />
          {isSearching ? (
            <SpinnerWrapper>
              <DefaultSpinner isDark={true} />
            </SpinnerWrapper>
          ) : (
            <>
              {filteredVideos &&
                filteredVideos.map((video: Video, idx) => {
                  return (
                    <ListVideoCard
                      key={video.id}
                      video={video}
                      status={video.isWatched ? "watched" : ""}
                      onAction={() => handleActionToggle(video)}
                      isUpNext={unwatchedVideoIdx === idx}
                      userPlaylists={userPlaylists}
                    />
                  );
                })}
            </>
          )}
        </PlaylistPageContent>
      )}
      <ActionMenu
        item={selectedItem}
        isOpen={isActionOpen}
        onClose={() => handleActionClose()}
      />
      <ShareModal
        item={collection}
        isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
        onClose={() => setIsShareOpen(false)}
      />
    </Wrapper>
  );
}

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
`;

const Wrapper = styled.div<{ isActionOpen: boolean }>`
  display: flex;
  flex-direction: column;
`;

const FeaturedHeader = styled.div`
  padding: 20px;
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  background: linear-gradient(180deg, #161517 0%, #332f36 100%);
  ${media.desktop} {
    flex-direction: row;
    gap: 10px;
    align-items: center;
    padding: 40px;
    padding-top: 110px;
  }
`;

const PlaylistLowerTextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
`;

const PlaylistLowerButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SharedText = styled.div`
  color: #fff;
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.28px;
`;

const PlaylistTitle = styled(SharedText)`
  font-size: 18px;
  letter-spacing: -0.36px;
  line-height: 20px; /* 111.111% */
  letter-spacing: -0.36px;
  flex: 1 0 0;
  text-transform: capitalize;
  ${media.desktop} {
    font-size: 40px;
    letter-spacing: -0.8px;
    line-height: 40px;
  }
`;

const SharedTextLight = styled(SharedText)`
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

const HeaderButton = styled(Button)`
  width: 40px;
  height: 40px;
`;

const PlaylistPageContent = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
`;
