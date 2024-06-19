import { AxiosResponse, AxiosError } from "axios";
import axios from "../../api/axios";
import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { FlowType } from "../types";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";

import {
  ApiSeriesWithVideos as Series,
  ApiVideo as Video,
  ApiSearch as Search,
  ApiTrackVideo as TrackVideo,
} from "../../types/apiResponses";

export class VideoUI extends Store {
  // TODO: URLs and stuff should be moved to environment variables
  @observable currentId: number | null = null;
  @observable current: Video | null = null;

  // Series related data
  @observable series: Series[] = [];
  @observable currentSeries: Series | null = null;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  @action
  setCurrentId(id: number) {
    this.currentId = id;
  }

  @flow
  *getAllSeries(): FlowType {
    try {
      const response = (yield axios.get<{ series: Series[] }>(
        `${this.application.baseUrl}/video/series`
      )) as AxiosResponse<{ series: Series[] }>;
      this.series = response.data.series;
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  @flow
  *getSeriesById(id: number): FlowType {
    if (id === this.currentSeriesId) return;
    try {
      if (!id) throw new Error("No series id provided");
      const response = (yield axios.get<{ series: Series }>(
        `${this.application.baseUrl}/video/series/${id}`
      )) as AxiosResponse<{ series: Series }>;
      this.currentSeries = response.data.series;
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  @flow
  *getVideoById(id: number | string): FlowType {
    if (typeof id === "string") id = parseInt(id);
    if (id === this.currentId) return;
    try {
      if (!id) throw new Error("No video id provided");
      this.setCurrentId(id);
      const response = (yield axios.get<{ video: Video }>(
        `${this.application.baseUrl}/video/${id}`
      )) as AxiosResponse<{ video: Video }>;
      this.current = response.data.video;
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  @computed
  get currentSeriesId(): number {
    if (!this.currentSeries) return 0;
    return this.currentSeries.id;
  }

  @computed
  get upNextVideoId(): number {
    if (!this.currentSeries) return 0;
    if (!this.currentSeries.videos.length) return 0;

    // Get the current series videos
    const videos = this.currentSeries.videos;

    // Get the first video where the isWatched is false
    const upNextVideo = videos.find((video) => !video.isWatched);
    if (!upNextVideo) return 0;

    return upNextVideo.id;
  }
}
