import { ApiVideo as Video } from "../../types/apiResponses";

export const videoDurationToTime = (duration: number) => {
  let minutes = String(Math.floor(duration / 60));
  let seconds = String(duration % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const getUpNextVideo = (videos: Video[]) => {
  for (let i = 0; i < videos.length; i++) {
    if (!videos[i].isWatched) {
      return i;
    }
  }
  return null;
};

export const getUnwatchedVideosLength = (videos: Video[]) => {
  const unwatchedVideos = videos.filter((video) => !video.isWatched);
  return unwatchedVideos.length;
};
