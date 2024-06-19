import React from "react";
import { ApiSeries } from "../types/apiResponses";
import { Types } from "./types";
import { ActionMap } from "./types";

type SearchPayload = {
  [Types.ToggleSearch]: {
    searchOpen: boolean;
  };
  [Types.CloseSearch]: false;
};

export type SearchActions =
  ActionMap<SearchPayload>[keyof ActionMap<SearchPayload>];

export const searchReducer = (state: boolean, action: SearchActions) => {
  switch (action.type) {
    case Types.ToggleSearch:
      return action.payload.searchOpen;
    case Types.CloseSearch:
      return false;
    default:
      return state;
  }
};
