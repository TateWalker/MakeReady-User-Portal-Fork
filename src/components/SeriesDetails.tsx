import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ApiSeries as Series } from "../types/apiResponses";
import ArrowRight from "../static/icons/ArrowRight";
import IconBox from "./IconBox";
import Tag from "./Tag";
import { getSeriesById } from "../api/video";
import SearchSlideUp from "./SearchSlideUp";

interface IProps {
  series: Series;
}

export default function SeriesDetails(props: IProps) {
  const { series } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [series, setSeries] = useState<Series | null>(null);

  // useEffect(() => {
  //     const fetchSeries = async () => {
  //         setSeries(await getSeriesById(id));
  //     };
  //     fetchSeries();
  // }, []);

  const handleMoreSpeaker = () => {
    setIsSearchOpen(true);
  };

  return (
    <SeriesDetailsWrapper>
      {series.speakers.length > 0 && (
        <SeriesSpeakerWrapper>
          <SpeakerPhoto
            src={series.speakers.length ? series.speakers[0].ThumbnailUrl : ""}
          ></SpeakerPhoto>
          <SpeakerInfo>
            <SpeakerLabel>Series Speaker</SpeakerLabel>
            <SpeakerName>
              {series.speakers.length ? series.speakers[0].name : ""}
            </SpeakerName>
            <SpeakerDescription>
              {series.speakers.length ? series.speakers[0].bio : ""}
            </SpeakerDescription>
            <MoreInfoWrapper onClick={() => handleMoreSpeaker()}>
              <MoreSpeakerInfo>More from this speaker</MoreSpeakerInfo>
              <IconBox>
                <ArrowRight />
              </IconBox>
            </MoreInfoWrapper>
          </SpeakerInfo>
        </SeriesSpeakerWrapper>
      )}
      <SeriesText>{series ? series.description : ""}</SeriesText>
      {/* <SeriesTagsWrapper>
        {series.tags
          ? series.tags.map((tag, index) => {
              return <Tag key={index} text={tag} />;
            })
          : ""}
      </SeriesTagsWrapper> */}
      <SearchSlideUp
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </SeriesDetailsWrapper>
  );
}

const SeriesDetailsWrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const SeriesSpeakerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  background: rgba(24, 20, 29, 0.1);
`;

const SpeakerPhoto = styled.img`
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const SpeakerInfo = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const SharedText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  letter-spacing: -0.48px;
`;

const SpeakerLabel = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: 1.4px;
  flex: 1 0 0;
  opacity: 0.5;
`;

const SpeakerName = styled(SharedText)``;

const SpeakerDescription = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 20px;
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

const SeriesText = styled(SharedText)`
  align-self: stretch;
  font-size: 18px;
  line-height: 30px;
  font-weight: 400;
  letter-spacing: unset;
`;

const SeriesTagsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 4px;
  flex-wrap: wrap;
`;
