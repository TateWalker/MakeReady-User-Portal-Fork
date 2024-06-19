import React from "react";
import { ApiSeriesWithVideos as Series } from "../types/apiResponses";
import fallbackThumbnail from "../static/images/thumbnail404.jpg";
import { classnames } from "../lib/utils/classnames";
import { observer } from "mobx-react";

import "./styles/SeriesCard.scss";
import TitleStack from "./TitleStack";
import { when } from "../lib/utils/when";

export enum SeriesCardMode {
  FILL = "fill",
  STACK = "stack",
  HEADER = "header",
}

interface IProps {
  series: Series;
  children?: React.ReactNode;
  className?: string;
  stack?: boolean;
  mode?: SeriesCardMode;
  onClick?: () => void;
}

const SeriesCard = observer(({ ...props }: IProps) => {
  const {
    series,
    children,
    stack = false,
    mode = SeriesCardMode.STACK,
    onClick,
    className,
  } = props;

  const thumbnail = series.ThumbnailFile
    ? series.ThumbnailUrl
    : fallbackThumbnail;

  const wrapperStyles: React.CSSProperties = {
    backgroundImage: `url(${thumbnail})`,
  };

  const handleClick = () => {
    onClick?.();
  };

  // Do nothing if there is no series
  if (!series) return;

  return (
    <div
      className={classnames("SeriesCard", `SeriesCard--${mode}`)}
      style={wrapperStyles}
      onClick={handleClick}
    >
      <div className={"SeriesCard__Top"}>
        <div
          className={classnames(
            "SeriesCard__Title",
            stack ? "SeriesCard__Title--stack" : "SeriesCard__Title--inline"
          )}
        >
          {when(stack, <TitleStack title={series.name} />, series.name)}
        </div>
        <div className={"SeriesCard__Tagline"}>{series.tagline} </div>
      </div>
      <div className={"SeriesCard__Bottom"}>
        <div className={"SeriesCard__Count"}>
          <span>{series.videoCount}</span>
          <div>Videos</div>
        </div>
        {when(children, <div className="SeriesCard__Children">{children}</div>)}
      </div>
    </div>
  );
});

export default SeriesCard;
