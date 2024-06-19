import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ApiSeries as Series } from "../types/apiResponses";
import fallbackThumbnail from "../static/images/thumbnail404.jpg";

interface IProps {
  series: Series;
  className?: string;
  onClick?: () => void;
}

export default function HomeSeriesView(props: IProps) {
  const { series, className, onClick } = props;
  const navigate = useNavigate();

  return (
    <Wrapper
      image={series.ThumbnailFile ? series.ThumbnailUrl : fallbackThumbnail}
      className={className}
      onClick={() => {
        onClick ? onClick() : navigate(`/series/${series.id}`);
      }}
    >
      <Title>{series.name}</Title>
      <VideoCountWrapper>
        <VideoCount>{series.videoCount}</VideoCount>
        <VideoText>Videos</VideoText>
      </VideoCountWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ image: string }>`
  display: flex;
  padding: 20px;
  flex-direction: column;
  height: 200px;
  min-width: 312px;
  justify-content: space-between;
  background-image: url(${(props) => props.image});
  background-size: cover;
  cursor: pointer;
  /* border: 4px solid rgba(255, 255, 255, 0); */
`;

const VideoCountWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Title = styled.div`
  color: #ffffff;
  font-family: Anton;
  text-transform: uppercase;
  font-style: normal;
  font-weight: 400;
  font-size: 60px;
  line-height: 100%;
  letter-spacing: -1.2px;
`;

const SharedText = styled.div`
  font-family: Open Sans;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.24px;
  color: #ffffff;
`;

const VideoCount = styled(SharedText)``;

const VideoText = styled(SharedText)`
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;
