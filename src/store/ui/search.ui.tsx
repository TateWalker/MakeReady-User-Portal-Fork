import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { ApiSearch as Search } from "../../types/apiResponses";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";
import axios, { AxiosError, AxiosResponse } from "axios";

export class SearchUI extends Store {
  // TODO: GLobalize this someday
  @observable active: boolean = false;
  @observable query: string = "";
  @observable results: Search = {
    videos: [],
    series: [],
    tags: [],
  };
  @observable loading: boolean = false;
  @observable timer: number = 0;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  @action
  setActive() {
    this.active = true;
  }

  @action
  setQuery(query: string) {
    this.query = query;
  }

  @action
  toggleActive() {
    this.active = !this.active;
  }

  @action
  close() {
    this.active = false;
  }

  @flow
  *search() {
    // Don't search if there is no query
    if (!this.query) return;
    // Search
    try {
      const response = (yield axios.post<Search>(
        `${this.application.baseUrl}/video/search`,
        { query: this.query }
      )) as AxiosResponse<Search>;
      if (!response.data) {
        throw new Error("No search results found");
      }
      this.results = response.data;
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }
}
