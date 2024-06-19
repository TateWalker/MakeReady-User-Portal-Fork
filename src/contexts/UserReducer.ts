import React from "react";
import { Types } from "./types";
import { ApiProfile } from "../types/apiResponses";
import { ActionMap } from "./types";

type UserPayload = {
  [Types.SetUser]: {
    user: ApiProfile;
  };
  [Types.ClearUser]: {};
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const userReducer = (state: ApiProfile | null, action: UserActions) => {
  switch (action.type) {
    case Types.SetUser:
      return action.payload.user;
    case Types.ClearUser:
      return null;
    default:
      return state;
  }
};
