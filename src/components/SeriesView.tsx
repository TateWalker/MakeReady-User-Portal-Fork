import styled from "styled-components";
import React from "react";
interface IProps {
  title: string;
  tagline: string;
  videoCount: number;
  image: string;
}
export default function SeriesView(props: IProps) {
  const { title, tagline, videoCount, image } = props;
  return (
    <Wrapper image={image}>
      <Title>{title}</Title>
      <Tagline>{tagline}</Tagline>
      <VideoCountWrapper>
        <VideoCount>{videoCount}</VideoCount>
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
  background-size: contain;
  /* border: 4px solid rgba(255, 255, 255, 0); */
`;

const VideoCountWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const VideoCount = styled.div`
  color: #ffffff;
  font-family: Anton;
  font-style: normal;
  font-weight: 400;
  font-size: 60px;
  line-height: 100%;
  letter-spacing: -1.2px;
`;
const VideoText = styled.div`
  color: #ffffff;
  font-family: Open Sans;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.24px;
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

const Tagline = styled.div`
  color: #ffffff;
  font-family: Open Sans;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.24px;
`;
