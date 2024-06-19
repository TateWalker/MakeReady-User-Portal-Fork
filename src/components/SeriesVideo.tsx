import React from "react";
import styled from "styled-components";
import Button from "./Button";
import IconBox from "./IconBox";
import StatusLabel from "./StatusLabel";
import Play from "../static/icons/Play";
import DotMenu from "../static/icons/DotMenu";
import { videoDurationToTime } from "../lib/utils/videoUtils";

interface IProps {
  id: number;
  title: string;
  duration: number;
  status: string;
}

export default function SeriesVideo(props: IProps) {
  const { id, title, status } = props;
  const duration = videoDurationToTime(props.duration);
  return (
    <SeriesVideoWrapper key={id}>
      <SquareButton color="#18141D">
        <IconBox>
          <Play fill="#fff" />
        </IconBox>
      </SquareButton>
      <VideoDetails>
        <VideoTitle>{title}</VideoTitle>
        <VideoDetailsBottom>
          <VideoDuration>{duration}</VideoDuration>
          <StatusLabel
            color={status == "up next" ? "purple" : "muted"}
            status={status}
          />
        </VideoDetailsBottom>
      </VideoDetails>
      <SquareButton color="transparent">
        <IconBox>
          <DotMenu fill="#18141D" />
        </IconBox>
      </SquareButton>
    </SeriesVideoWrapper>
  );
}

const SeriesVideoWrapper = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  background: rgba(24, 20, 29, 0.05);
`;

const SquareButton = styled(Button)`
  max-width: 50px;
  max-height: 50px;
`;

const VideoDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
`;

const VideoDetailsBottom = styled.div`
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

const VideoTitle = styled(SharedText)``;

const VideoDuration = styled(SharedText)`
  color: #6c47ff;
  font-size: 12px;
  letter-spacing: 1.2px;
`;
