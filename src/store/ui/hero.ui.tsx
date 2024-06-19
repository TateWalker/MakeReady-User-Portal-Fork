import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";
import type { FlowType } from "../types";
import axios, { AxiosResponse } from "axios";
import { ApiHero } from "../../types/apiResponses";

export class HeroUI extends Store {
  // TODO: MOve URLs to environment variables & APIs to a separate class someday
  @observable items: ApiHero[] = [];
  @observable currentIndex: number = 1;
  @observable loading: boolean = false;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  @action
  nextHero() {
    this.currentIndex++;
    if (this.currentIndex >= this.items.length) {
      this.currentIndex = 0;
    }
  }

  @action
  prevHero() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.items.length - 1;
    }
  }

  @flow
  *getItems(): FlowType {
    // Load once
    if (this.items.length) return;
    this.loading = true;
    try {
      const response = (yield axios.get<{ featuredHeros: ApiHero[] }>(
        `${this.application.baseUrl}/featured/hero`
      )) as AxiosResponse<{ featuredHeros: ApiHero[] }>;
      this.items = response.data.featuredHeros;
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  @computed
  get list(): ApiHero[] {
    this.getItems();
    return this.items;
  }
}
