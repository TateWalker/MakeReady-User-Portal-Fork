import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import SeriesDetail from "../components/SeriesDetails";
import SeriesEpisodes from "../components/SeriesEpisodes";
import { ApiSeriesWithVideos as Series } from "../types/apiResponses";

import SeriesCard, { SeriesCardMode } from "../components/SeriesCard";
import Button, { IButtonMode, IButtonSize } from "../components/Button";
import { useParams, useNavigate, createSearchParams } from "react-router-dom";
import { getSeriesById } from "../api/video";
import useDelayUnmount from "../hooks/useDelayUnmount";
import ShareModal from "../components/ShareModal";
import { getSubscriptions } from "../api/subscriptions";
import DefaultSpinner from "../components/DefaultSpinner";
import { handleSubscriptionToggle } from "../lib/utils/subscriptionUtils";
import { MainContext } from "../contexts/MainContext";
import { Icon, IconShape, Icons } from "../components/icon";
import { observer } from "mobx-react";

import "./styles/VideoSeries.scss";
import { Application } from "../store";

const VideoSeries = observer(({ ...props }) => {
  const [showEpisodes, setShowEpisodes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [series, setSeries] = useState<Series>();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const navigate = useNavigate();
  const params = useParams();
  const id: string = params.id!;
  const isLoggedIn = Application.session.user.isAuthenticated;
  const subscriptions = Application.ui.subscription.all;

  const handleOpenShare = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/auth");
    } else {
      setIsShareOpen(true);
    }
  };

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const seriesData = await getSeriesById(parseInt(id));
        setSeries(seriesData);
        setIsLoading(false);
      } catch (e) {}
    };
    fetchSeries();
  }, [id]);

  useEffect(() => {
    if (isShareOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isShareOpen]);

  const handleVideoNav = () => {
    if (series?.videos.length) {
      const videoId = series.videos[0].id;
      navigate({
        pathname: `/video/${videoId}`,
        search: createSearchParams({
          type: "series",
          source: `${series.id}`,
        }).toString(),
      });
    }
  };

  return (
    <SeriesPageWrapper className={"VideoSeries"}>
      {isLoading ? (
        <SpinnerWrapper>
          <DefaultSpinner isDark={true} />
        </SpinnerWrapper>
      ) : (
        <>
          {series ? (
            <SeriesCard
              mode={SeriesCardMode.HEADER}
              series={series}
              stack={true}
            >
              <div className={"VideoSeries__Buttons"}>
                <Button
                  disabled={!series.videos.length}
                  onClick={() => handleVideoNav()}
                >
                  <Icon provider={Icons} shape={IconShape.PLAY} size={20} />
                  Watch Now
                </Button>
                <Button
                  className={"ShareButton"}
                  mode={IButtonMode.ICON}
                  size={IButtonSize.LARGE}
                  onClick={() => handleOpenShare()}
                  iconShape={IconShape.SHARE}
                  disabled={!isLoggedIn}
                />
                <Button
                  className={"NotificationButton"}
                  mode={IButtonMode.ICON}
                  size={IButtonSize.LARGE}
                  disabled={!isLoggedIn}
                  onClick={() => {
                    Application.ui.subscription.toggleSubscription(series.id);
                  }}
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
          ) : null}

          <TabWrapper>
            <SeriesTab
              active={!showEpisodes}
              onClick={() => setShowEpisodes(false)}
            >
              Details
            </SeriesTab>
            <SeriesTab
              active={showEpisodes}
              onClick={() => setShowEpisodes(true)}
            >
              Episodes
            </SeriesTab>
          </TabWrapper>

          {showEpisodes && series && (
            <SeriesEpisodes
              videos={series.videos}
              series={series}
            ></SeriesEpisodes>
          )}
          {!showEpisodes && series && (
            <SeriesDetail series={series}></SeriesDetail>
          )}
          {(isShareOpen || shareTransitionedIn) && (
            <ShareModal
              item={series!}
              isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
              onClose={() => setIsShareOpen(false)}
            />
          )}
        </>
      )}
    </SeriesPageWrapper>
  );
});

const SeriesPageWrapper = styled.div``;

const TabWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
`;

const SeriesTab = styled.div<{ active: boolean; onClick: () => void }>`
  display: flex;
  padding: 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  cursor: pointer;

  background: ${(props) => (props.active ? "transparent" : "#E8E7E8")};
  color: ${(props) => (props.active ? "#18141D" : "#8B898E")};

  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
  text-transform: uppercase;
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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  align-self: stretch;
`;

const ButtonText = styled(SharedText)<{ isDark?: boolean }>`
  color: ${(props) => (props.isDark ? "#000" : "#fff")};
  margin: 0;
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

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  align-self: center;
  min-height: 550px;
`;

export default VideoSeries;
