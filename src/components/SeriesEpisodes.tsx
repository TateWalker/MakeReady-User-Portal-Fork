import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import {
  ApiVideo as Video,
  ApiPlaylist as Playlist,
  ApiSeriesWithVideos as Series,
} from "../types/apiResponses";
import ListVideoCard from "./ListVideoCard";
import { getUpNextVideo } from "../lib/utils/videoUtils";
import { getMyPlaylists } from "../api/playlist";
import { observer } from "mobx-react";
import { classnames } from "../lib/utils/classnames";
import Loading, { iLoadingColor } from "./Loading";
interface IProps {
  videos: Video[];
  series: Series;
}

// SCSS
import "./styles/SeriesEpisodes.scss";

const SeriesEpisodes = observer(({ ...props }: IProps) => {
  const { videos, series } = props;
  const [unwatchedVideoIdx, setUnwatchedVideoIdx] = useState<number | null>();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(videos);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        let token = JSON.parse(access_token).token;
        const playlistData = await getMyPlaylists();
        setUserPlaylists(playlistData);
      }
    } catch (e) {
      console.log("Failed to fetch playlists", e);
    }
  };

  React.useEffect(() => {
    setUnwatchedVideoIdx(getUpNextVideo(videos));
  }, [videos]);

  React.useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className={classnames("SeriesEpisodes")}>
      <SearchBar
        videoList={videos}
        placeholder="Filter episodes by title, description"
        setVideoResults={(returnedVideos: Video[]) => {
          setFilteredVideos(returnedVideos);
        }}
        isSearching={(isSearching: boolean) => {
          setIsLoading(isSearching);
        }}
      />
      {isLoading ? (
        <Loading color={iLoadingColor.TRANSPARENT} />
      ) : (
        <div className={"SeriesEpisodes__List"}>
          {filteredVideos &&
            filteredVideos.map((video: Video, idx) => {
              return (
                <ListVideoCard
                  key={video.id}
                  video={video}
                  status={video.isWatched ? "watched" : ""}
                  isUpNext={unwatchedVideoIdx === idx}
                  userPlaylists={userPlaylists || []}
                  series={series}
                />
              );
            })}
        </div>
      )}
    </div>
  );
});

export default SeriesEpisodes;
