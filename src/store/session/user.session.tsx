import React from "react";
import axios from "../../api/axios";
import { AxiosResponse } from "axios";
import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { ApplicationStore } from "../application.store";
import type { FlowType } from "../types";
import type {
  ApiProfile as Profile,
  ApiProfileUpdate as ProfileUpdate,
  ApiUpdateProfile as UpdateProfile,
  ApiChangeNotification as ChangeNotification,
} from "../../types/apiResponses";
import { Store } from "../store";

export class UserSession extends Store {
  @observable isAuthenticated: boolean = false;
  @observable token: string | null = null;
  @observable profile: Profile | null = null;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);

    // Check login every time this loads
    this.checkLogin();
  }

  @action
  setAuthenticated(auth: boolean) {
    this.isAuthenticated = auth;
  }

  @action
  setToken(token: string) {
    this.token = token;
  }

  @computed
  get login(): boolean {
    return this.isAuthenticated;
  }

  @flow
  *logout(): FlowType {
    try {
      localStorage.removeItem("access_token");
      this.setAuthenticated(false);
      this.profile = null;
      this.application.ui.playlist.clear();
      this.application.ui.subscription.clear();
    } catch (error) {
      console.error(error);
    }
  }

  @flow
  *getSelf(): FlowType {
    try {
      const response = (yield axios.get<Profile>(
        `${this.application.baseUrl}/profile/self`
      )) as AxiosResponse<Profile>;

      if (!response.data) {
        throw new Error("No profile found");
      }
      this.profile = response.data;
      // Load playlists
      this.setAuthenticated(true);
      // Load playlists and subscriptions
      this.application.ui.playlist.loadPlaylists();
      this.application.ui.subscription.loadSubscriptions();
    } catch (error) {
      console.error(error);
      this.setAuthenticated(false);
      this.profile = null;
    }
  }

  @flow
  *updateProfile(data: ProfileUpdate): FlowType {
    if (!data.name && !data.zipcode && !data.emailNotification) return;
    try {
      const response = (yield axios.post<UpdateProfile>(
        `${this.application.baseUrl}/profile/update_profile`,
        data
      )) as AxiosResponse<UpdateProfile>;
      if (!response.data) {
        throw new Error("Could not update profile");
      }
      this.getSelf();
    } catch (error) {
      console.error(error);
    }
  }

  @flow
  *checkLogin(): FlowType {
    try {
      let accessToken = localStorage.getItem("access_token");
      let parsedToken = JSON.parse(accessToken!);
      if (!parsedToken) {
        throw new Error("No token found or is null");
      }
      if (!parsedToken.expiration) {
        throw new Error("No expiration found");
      }
      let exp = Number(parsedToken.expiration);
      if (exp > Date.now() / 1000) {
        if (!this.profile) {
          this.setAuthenticated(true);
          this.getSelf();
        }
      } else {
        localStorage.removeItem("access_token");
      }
    } catch (e) {
      console.error(e);
      this.profile = null;
      this.setAuthenticated(false);
    }
  }

  @computed
  get firstName(): string {
    if (!this.profile) return "";
    if (!this.profile.name) return "";
    return this.profile.name.split(" ")[0] || "User";
  }

  @computed
  get displayName(): string {
    if (!this.profile) return "";
    // Default to the email if no name is set
    if (!this.profile.name || this.profile.name === "") {
      return this.profile.email.split("@")[0];
    }
    // Get the first name
    return this.firstName;
  }
}
