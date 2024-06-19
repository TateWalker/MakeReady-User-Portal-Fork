import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";

import {
  ApiHero,
  CTA_TYPE,
  ApiSeriesWithVideos as Series,
  ApiVideo as Video,
  ApiSearch as Search,
  ApiTrackVideo as TrackVideo,
  ApiFeaturedTag,
} from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const getAllSeries = async (): Promise<Series[]> => {
  try {
    const response: AxiosResponse<{ series: Series[] }> = await axios.get(
      `${baseUrl}/video/series`
    );
    return response.data.series;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const getSeriesById = async (
  id: number,
  token?: string
): Promise<Series> => {
  try {
    const response: AxiosResponse<{ series: Series }> = await axios.get(
      `${baseUrl}/video/series/${id}`,
      { headers: { Authorization: token } }
    );
    return response.data.series;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const getVideoById = async (id: number) => {
  try {
    const response: AxiosResponse = await axios.get(`${baseUrl}/video/${id}`);
    return response.data.video;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const searchVideo = async (query: string): Promise<Search> => {
  try {
    const response: AxiosResponse<Search> = await axios.post(
      `${baseUrl}/video/search`,
      { query: query }
    );
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const trackVideoProgress = async (
  videoId: number,
  progressSeconds: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ videoProgress: TrackVideo }> =
      await axios.post(`${baseUrl}/video/track_video_progress`, {
        videoId,
        progressSeconds,
      });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const getTagById = async (tagId: string): Promise<ApiFeaturedTag> => {
  try {
    const response: AxiosResponse = await axios.get(
      `${baseUrl}/video/tag/${tagId}`
    );
    return response.data.tag;
  } catch (error) {
    console.log(error);
    return {} as ApiFeaturedTag;
  }
};
