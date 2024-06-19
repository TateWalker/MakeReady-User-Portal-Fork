import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";
import type { FlowType } from "../types";
import axios from "../../api/axios";
import {
  ApiHero,
  ApiSeries,
  ApiPlaylist,
  ApiSeriesSubscription,
} from "../../types/apiResponses";
import { AxiosResponse } from "axios";

export class SubscriptionUI extends Store {
  // TODO: MOve URLs to environment variables & APIs to a separate class someday
  @observable data: ApiSeries[] = [];
  @observable loading: boolean = false;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);

    // Load subscriptions
    this.loadSubscriptions();
  }

  @action
  clear() {
    this.data = [];
  }

  @flow
  *loadSubscriptions(): FlowType {
    // Require login
    if (!this.application.session?.user.isAuthenticated) return;
    try {
      this.loading = true;
      const response = (yield axios.get<ApiSeries[]>(
        `${this.application.baseUrl}/subscriptions/series`
      )) as AxiosResponse<{ seriesSubscriptions: ApiSeries[] }>;
      this.data = response.data.seriesSubscriptions;
      console.log(response.data.seriesSubscriptions);
      this.loading = false;
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
    }
  }

  @flow
  *toggleSubscription(seriesId: number): FlowType {
    if (!this.application.session?.user.isAuthenticated) return;
    try {
      console.log("here");
      if (Array.from(this.data).find((series) => series.id === seriesId)) {
        yield this.unsubscribeFromSeries(seriesId);
      } else {
        yield this.subscribeToSeries(seriesId);
      }
      this.loadSubscriptions();
    } catch (error) {
      console.error("Failed to unsubscribe from series", error);
    }
  }

  @flow
  *subscribeToSeries(seriesId: number): FlowType {
    try {
      const response = (yield axios.post(
        `${this.application.baseUrl}/subscriptions/series`,
        { seriesId }
      )) as AxiosResponse<ApiSeries>;
    } catch (error) {
      console.error("Failed to subscribe to series", error);
    }
  }

  @flow
  *unsubscribeFromSeries(seriesId: number): FlowType {
    try {
      (yield axios.delete(
        `${this.application.baseUrl}/subscriptions/series/${seriesId}`
      )) as AxiosResponse<ApiSeries>;
    } catch (error) {
      console.error("Failed to unsubscribe from series", error);
    }
  }

  @computed
  get all() {
    return this.data;
  }
}
