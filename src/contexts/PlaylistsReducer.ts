import React from "react";
import { ApiPlaylist } from "../types/apiResponses";
import { Types } from "./types";
import { ActionMap } from "./types";

type PlaylistPayload = {
  [Types.SetPlaylists]: {
    playlists: ApiPlaylist[];
  };
  [Types.ClearPlaylists]: {};
};

export type PlaylistActions =
  ActionMap<PlaylistPayload>[keyof ActionMap<PlaylistPayload>];

export const playlistsReducer = (
  state: ApiPlaylist[],
  action: PlaylistActions
) => {
  switch (action.type) {
    case Types.SetPlaylists:
      return action.payload.playlists;
    case Types.ClearPlaylists:
      return null;
    default:
      return state;
  }
};
