import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import Button, { IButtonMode, IButtonSize } from "../components/Button";
import IconBox from "../components/IconBox";
import ArrowRight from "../static/icons/ArrowRight";
import Play from "../static/icons/Play";
import Share from "../static/icons/Share";
import NotificationsEmpty from "../static/icons/NotificationsEmpty";
import SeriesCard, { SeriesCardMode } from "../components/SeriesCard";
import {
  ApiSeriesWithVideos as Series,
  ApiVideo as Video,
  ApiPlaylist as Playlist,
} from "../types/apiResponses";

import {
  createSearchParams,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { getAllSeries } from "../api/video";
import {
  getUnwatchedVideosLength,
  getUpNextVideo,
} from "../lib/utils/videoUtils";
import ListVideoCard from "../components/ListVideoCard";
import ShareModal from "../components/ShareModal";
import useDelayUnmount from "../hooks/useDelayUnmount";
import DefaultSpinner from "../components/DefaultSpinner";
import NotificationsFull from "../static/icons/NotificationsFull";
import { MainContext } from "../contexts/MainContext";
import {
  fetchSubscriptions,
  handleSubscriptionToggle,
} from "../lib/utils/subscriptionUtils";
import { fetchPlaylists } from "../lib/utils/playlistUtils";
import { Icon, IconShape, Icons } from "../components/icon";
import { media } from "../styles/media";
import { MinBreakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import { Application } from "../store";
import { observer } from "mobx-react";

const AllSeries = observer(({ ...props }) => {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedItem, setSelectedItem] = useState<Series | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [videoCount, setVideoCount] = useState(0);
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = Application.session.user.isAuthenticated;
  const subscriptions = Application.ui.subscription.all;

  const navigate = useNavigate();
  const handleSeriesNav = (id: number) => {
    navigate(`/series/${id}`);
    window.scrollTo(0, 0);
  };

  const handleShareToggle = (item: Series | null) => {
    if (!isLoggedIn) return;
    else {
      setSelectedItem(item);
      setIsShareOpen(true);
    }
  };

  const isDesktop = useMediaQuery(MinBreakpoints.desktop, "min");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const seriesResults = await getAllSeries();
        if (seriesResults) {
          setSeriesList(seriesResults);
          setVideoCount(
            seriesResults.reduce((acc, series) => acc + series.videos.length, 0)
          );
        } else {
          setSeriesList([]);
        }
      } catch (e) {
        console.log("Failed to fetch series or playlists", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const returnSeriesList = (series: Series) => {
    if (series.videos) {
      const unwatchedVideoIdx = getUpNextVideo(series.videos);
      return (
        <SeriesList>
          {series.videos.map((video: Video, idx) => {
            // Only show 10 videos on mobile
            // Only show 4 videos on desktop
            if (idx > 9 || (isDesktop && idx > 3)) return;
            return (
              <ListVideoCard
                key={idx}
                video={video}
                status={video.isWatched ? "watched" : ""}
                isUpNext={unwatchedVideoIdx === idx}
                series={series}
              />
            );
          })}
        </SeriesList>
      );
    } else {
      return <SeriesList></SeriesList>;
    }
  };

  return (
    <SeriesWrapper className="SeriesWrapper">
      {isLoading ? (
        <SpinnerWrapper>
          <DefaultSpinner isDark={true} />
        </SpinnerWrapper>
      ) : (
        <>
          <SeriesHeader>
            <SeriesTitle>Series</SeriesTitle>
            <SeriesHeaderLower>
              <SeriesLowerTextWrapper>
                <SharedText>{seriesList?.length}</SharedText>
                <SharedTextLight>Series</SharedTextLight>
              </SeriesLowerTextWrapper>
              <SeriesLowerTextWrapper>
                <SharedText>{videoCount}</SharedText>
                <SharedTextLight>Videos</SharedTextLight>
              </SeriesLowerTextWrapper>
            </SeriesHeaderLower>
          </SeriesHeader>
          <SeriesBody>
            {seriesList ? (
              seriesList.map((series, idx) => {
                return (
                  <SeriesEntry key={idx}>
                    <SeriesCard mode={SeriesCardMode.FILL} series={series}>
                      <div className={"SeriesCard__Buttons"}>
                        <Button
                          mode={IButtonMode.PRIMARY}
                          size={IButtonSize.LARGE}
                          onClick={() => handleSeriesNav(series.id)}
                        >
                          View Series
                          <Icon
                            provider={Icons}
                            shape={IconShape.ARROW_RIGHT}
                            size={14}
                          />
                        </Button>
                        <Button
                          className={"ShareButton"}
                          mode={IButtonMode.ICON}
                          size={IButtonSize.LARGE}
                          disabled={!isLoggedIn}
                          onClick={() => handleShareToggle(series)}
                          iconShape={IconShape.SHARE}
                        />
                        <Button
                          className={"NotificationButton"}
                          mode={IButtonMode.ICON}
                          size={IButtonSize.LARGE}
                          disabled={!isLoggedIn}
                          onClick={() =>
                            Application.ui.subscription.toggleSubscription(
                              series.id
                            )
                          }
                          iconShape={
                            subscriptions.some((s) => s.id === series.id)
                              ? IconShape.ALERT_FULL
                              : IconShape.ALERT_EMPTY
                          }
                        />
                        <Button
                          className={"WatchButton"}
                          mode={IButtonMode.ICON}
                          size={IButtonSize.LARGE}
                          disabled={!series.videos.length}
                          onClick={() => {
                            if (!series.videos.length) return;
                            navigate({
                              pathname: `/video/${series.videos[0].id}`,
                              search: createSearchParams({
                                type: "series",
                                source: `${series.id}`,
                              }).toString(),
                            });
                          }}
                          iconShape={IconShape.PLAY}
                        />
                      </div>
                    </SeriesCard>
                    <SeriesListWrapper>
                      <SeriesListHeader>
                        <SeriesListHeaderLeft>
                          <SeriesListHeaderTitle>Up Next</SeriesListHeaderTitle>
                          <SeriesListHeaderCountWrapper>
                            <SeriesListHeaderCount>
                              {getUnwatchedVideosLength(series.videos)}
                            </SeriesListHeaderCount>
                            <SeriesListHeaderTitle>/</SeriesListHeaderTitle>
                            <SeriesListHeaderTitle>
                              {series.videos.length}
                            </SeriesListHeaderTitle>
                          </SeriesListHeaderCountWrapper>
                        </SeriesListHeaderLeft>
                        <SeriesListHeaderRight
                          onClick={() => navigate(`/series/${series.id}`)}
                        >
                          <SeriesListHeaderViewAll>
                            View all episodes
                          </SeriesListHeaderViewAll>
                          <ArrowButton color="transparent">
                            <IconBox>
                              <ArrowRight fill="#100F12" />
                            </IconBox>
                          </ArrowButton>
                        </SeriesListHeaderRight>
                      </SeriesListHeader>
                      {returnSeriesList(series)}
                    </SeriesListWrapper>
                  </SeriesEntry>
                );
              })
            ) : (
              <></>
            )}
          </SeriesBody>
        </>
      )}
      <ShareModal
        item={selectedItem}
        isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
        onClose={() => setIsShareOpen(false)}
      />
    </SeriesWrapper>
  );
});

const SeriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SeriesHeader = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  background: linear-gradient(180deg, #161517 0%, #332f36 100%);
  padding-top: 90px;
`;

const SeriesHeaderLower = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SeriesLowerTextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
`;

const SharedText = styled.div`
  color: #fff;
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.28px;
  text-transform: uppercase;
`;

const SeriesTitle = styled(SharedText)`
  font-size: 18px;
  line-height: 80%; /* 14.4px */
  letter-spacing: -0.36px;
`;

const SharedTextLight = styled(SharedText)`
  color: rgba(255, 255, 255, 0.5);
`;

const SeriesBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const SeriesEntry = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  height: fit-content;
  ${media.desktop} {
    flex-direction: row;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  align-self: stretch;
`;

const ButtonText = styled(SharedText)`
  color: #18141d;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
  text-transform: unset;
`;

const ViewButton = styled(Button)`
  flex: 1 0 0;
`;

const SecondaryButton = styled(Button)`
  width: 40px;
  height: 100%;
  flex: 0 1 0;
`;

const SeriesListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  flex: 1 1;
`;

const SeriesListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

const SeriesListHeaderTitle = styled(SharedText)`
  color: #18141d;
  font-size: 12px;
  line-height: 20px; /* 166.667% */
  letter-spacing: 1.2px;
`;

const SeriesList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
`;

const SeriesListHeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const SeriesListHeaderCountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SeriesListHeaderCount = styled(SeriesListHeaderTitle)`
  color: #6c47ff;
`;

const SeriesListHeaderRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const SeriesListHeaderViewAll = styled(SharedText)`
  color: #18141d;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  text-transform: unset;
  letter-spacing: initial;
`;

const ArrowButton = styled(Button)`
  max-width: 14px;
  max-height: 14px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  padding-top: 70px;
  min-height: 500px;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export default AllSeries;
