import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";
import { ApiShare as Share } from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const shareSeries = async (
  emails: string[],
  phoneNumbers: string[],
  message: string,
  seriesId: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<Share> = await axios.post(
      `${baseUrl}/share/series`,
      { emails, phoneNumbers, message, seriesId }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const sharePlaylist = async (
  emails: string[],
  phoneNumbers: string[],
  message: string,
  playlistLinkSlug: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<Share> = await axios.post(
      `${baseUrl}/share/playlist`,
      { emails, phoneNumbers, message, playlistLinkSlug }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const shareVideo = async (
  emails: string[],
  phoneNumbers: string[],
  message: string,
  videoId: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<Share> = await axios.post(
      `${baseUrl}/share/video`,
      { emails, phoneNumbers, message, videoId }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const shareFeatured = async (
  emails: string[],
  phoneNumbers: string[],
  message: string,
  featuredId: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<Share> = await axios.post(
      `${baseUrl}/share/featured`,
      { emails, phoneNumbers, message, featuredId }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};
