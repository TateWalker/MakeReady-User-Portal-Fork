import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";
import type { FlowType } from "../types";
import axios from "../../api/axios";
import {
  ApiVideo,
  ApiGetPlaylist,
  ApiCreatePlaylist,
  ApiAddToPlaylist,
  ApiRemoveFromPlaylist,
  ApiDeletePlaylist,
  ApiRenamePlaylist,
  ApiMyPlaylists,
  ApiPlaylist,
} from "../../types/apiResponses";
import { AxiosResponse } from "axios";

export class PlaylistUI extends Store {
  // TODO: MOve URLs to environment variables & APIs to a separate class someday
  @observable data: ApiPlaylist[] = [];
  @observable selected: ApiPlaylist | null = null;
  @observable selectedVideos: ApiVideo[] = [];
  @observable loading: boolean = false;
  @observable filter: string = "";

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  @action
  setFilter(filter: string) {
    this.filter = filter;
  }

  @action
  clear() {
    this.data = [];
  }

  @flow
  *deletePlaylist(id: number): FlowType {
    if (!this.application.session?.user.isAuthenticated) return; // Shouldn't ever hit this
    try {
      yield axios.delete<ApiDeletePlaylist>(
        `${this.application.baseUrl}/playlist/playlist/${id}`
      );
      this.loadPlaylists();
    } catch (error) {
      console.error("Failed to delete playlist", error);
    }
  }

  @flow
  *loadPlaylists(): FlowType {
    // Require login
    if (!this.application.session?.user.isAuthenticated) return;
    try {
      this.loading = true;
      const response = (yield axios.get<ApiMyPlaylists>(
        `${this.application.baseUrl}/playlist/my_playlists`
      )) as AxiosResponse<ApiMyPlaylists>;
      this.data = response.data.playlists;
      this.loading = false;
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    }
  }

  @flow
  *loadPlaylist(playlistSlug: string): FlowType {
    // Make sure it's not loading
    if (this.loading) return;
    // Don't bother if already loaded
    if (this.selected?.linkSlug === playlistSlug) return;
    try {
      this.loading = true;
      const response = (yield axios.get<ApiGetPlaylist>(
        `${this.application.baseUrl}/playlist/playlist/${playlistSlug}`
      )) as AxiosResponse<ApiGetPlaylist>;
      this.selected = response.data.playlist;
      this.selectedVideos = response.data.videos;
      this.loading = false;
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    }
  }

  @flow
  *create(name: string): FlowType {
    try {
      if (!this.application.session?.user.isAuthenticated) {
        throw new Error("Not authenticated");
      }
      const response = (yield axios.post<ApiCreatePlaylist>(
        `${this.application.baseUrl}/playlist/create`,
        {
          name,
        }
      )) as AxiosResponse<ApiCreatePlaylist>;
      this.loadPlaylists();
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  }

  @computed
  get count() {
    return this.data.length;
  }

  @computed
  get all() {
    return this.data;
  }

  @computed
  get firstFive() {
    return this.data.slice(0, 5);
  }

  @computed
  get videoCount() {
    return this.data.reduce((acc, playlist) => acc + playlist.videoCount, 0);
  }

  @computed
  get videos() {
    if (!this.selectedVideos) return [];
    return this.selectedVideos;
  }

  @computed
  get filteredVideos() {
    if (!this.selectedVideos) return [];
    return this.selectedVideos.filter((video) =>
      video.title.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  @computed
  get upNext() {
    return this.filteredVideos.find((video) => !video.isWatched);
  }
}
