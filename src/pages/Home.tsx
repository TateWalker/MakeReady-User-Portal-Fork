import React, { useEffect, useState } from "react";
import {
  ApiVideo as Video,
  ApiSeriesWithVideos as Series,
  ApiFeaturedTag as FeaturedTag,
  ApiHero as Hero,
} from "../types/apiResponses";
import "../Home.css";
import styled from "styled-components";
import HeroSection from "../components/HeroSection";
import HomeSeriesView from "../components/HomeSeriesView";
import Carousel from "../components/Carousel";
import { getAllSeries, searchVideo } from "../api/video";
import { getFeaturedTags } from "../api/featured";
import DefaultSpinner from "../components/DefaultSpinner";
import { media } from "../styles/media";
import ThumbnailCard from "../components/ThumbnailCard";
import { classnames } from "../lib/utils/when";
import Loading, { iLoadingColor } from "../components/Loading";

import "./styles/Home.scss";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [series, setSeries] = useState<Series[]>([]);
  const [featuredTags, setFeaturedTags] = useState<FeaturedTag[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const seriesResults = await getAllSeries();
      if (seriesResults) {
        setSeries(seriesResults);
      } else {
        setSeries([]);
      }
      const collectionResults = await getFeaturedTags();
      if (collectionResults) {
        setFeaturedTags(collectionResults);
      } else {
        setFeaturedTags([]);
      }
      setIsLoading(false);
    };
    fetchData();
    console.log(featuredTags);
  }, []);

  return (
    <div className={classnames("Home")}>
      {isLoading ? (
        <Loading color={iLoadingColor.DARK} />
      ) : (
        <>
          <HeroSection />
          <div className="Home__Content">
            <Carousel
              title="Featured series"
              path="/series"
              viewAllText="View all series"
            >
              {series.map((series, idx) => (
                <HomeSeriesView key={idx} series={series} />
              ))}
            </Carousel>
            {featuredTags.map((featured, idx) => (
              <Carousel
                key={idx}
                title={"Featured Tag: " + featured.name}
                path={`/featured/${featured.id}`}
                viewAllText="View all for this tag"
              >
                {featured.videos.map((video: Video, videoIdx: number) => (
                  <ThumbnailCard
                    key={videoIdx}
                    video={video}
                    collection={featured}
                  />
                ))}
              </Carousel>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const HomeWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;

  ${media.desktop} {
    gap: 40px;
    padding-bottom: 40px;
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1 0 0;
`;
