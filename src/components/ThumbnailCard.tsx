import React from "react";
import {
  ApiVideo as Video,
  ApiFeaturedTag as Featured,
} from "../types/apiResponses";

import { useNavigate } from "react-router";
import { classnames } from "../lib/utils/classnames";
import { observer } from "mobx-react";

// Styles
import "./styles/ThumbnailCard.scss";
import { Icon, IconShape, Icons } from "./icon";
import { createSearchParams } from "react-router-dom";

interface IProps {
  video: Video;
  collection: Featured;
  isActive?: boolean;
}

const ThumbnailCard = observer(({ ...props }: IProps) => {
  const { video, isActive = false, collection } = props;

  const navigate = useNavigate();

  const handleVideoNav = (id: number) => {
    navigate({
      pathname: `/video/${id}`,
      search: createSearchParams({
        type: "collection",
        source: `${collection.id}`,
      }).toString(),
    });
  };

  const getVideoPercentage = () => {
    return (
      ((video.videoProgressSeconds / video.duration) * 100).toString() + "%"
    );
  };

  const barStyles: React.CSSProperties = {
    width: getVideoPercentage(),
  };

  // Do not proceed without a valid thumbnail
  if (!video.ThumbnailFile) {
    return;
  }

  return (
    <div
      className={classnames("ThumbnailCard")}
      onClick={() => handleVideoNav(video.id)}
    >
      <div className={"ThumbnailCard__Overlay"}>
        <Icon provider={Icons} shape={IconShape.PLAY} size={60} />
      </div>
      <div className="ThumbnailCard__Image">
        <img src={video.ThumbnailUrl} alt={video.title} />
      </div>
      <div className={"ThumbnailCard__Progress"}>
        <div style={barStyles}></div>
      </div>
    </div>
  );
});

export default ThumbnailCard;
