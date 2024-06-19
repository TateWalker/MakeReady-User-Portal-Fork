import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";

import {
  ApiSeries as Series,
  ApiSeriesSubscription as SeriesSubscription,
  ApiUnsubscribeSubscription as UnsubscribeSubscription,
  ApiVideo as Video,
} from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const getSubscriptions = async (): Promise<Series[]> => {
  try {
    const response: AxiosResponse<{
      seriesSubscriptions: Series[];
    }> = await axios.get(`${baseUrl}/subscriptions/series`, {});
    return response.data.seriesSubscriptions;
  } catch (error) {
    return [];
  }
};

export const subscribeToSeries = async (seriesId: number): Promise<boolean> => {
  try {
    const response: AxiosResponse<{
      seriesSubscription: SeriesSubscription;
    }> = await axios.post(`${baseUrl}/subscriptions/series`, {
      seriesId,
    });
    return response.status === 200;
  } catch (error) {
    console.log((error as AxiosError).message);
    return false;
  }
};

export const unsubscribeFromSeries = async (
  seriesId: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<UnsubscribeSubscription> = await axios.delete(
      `${baseUrl}/subscriptions/series/${seriesId}`
    );
    return response.status === 200;
  } catch (error) {
    console.log((error as AxiosError).message);
    return false;
  }
};

export const getLatestVideos = async (token: string): Promise<Video[]> => {
  try {
    const response: AxiosResponse<{
      videos: Video[];
    }> = await axios.get(`${baseUrl}/subscriptions`, {
      headers: { Authorization: token },
    });
    return response.data.videos;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};
