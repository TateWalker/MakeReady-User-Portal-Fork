import React from "react";
import { ApiSeries } from "../types/apiResponses";
import { Types } from "./types";
import { ActionMap } from "./types";

type SubscriptionPayload = {
  [Types.SetSubscriptions]: {
    subscriptions: ApiSeries[];
  };
  [Types.ClearSubscriptions]: {};
};

export type SubscriptionActions =
  ActionMap<SubscriptionPayload>[keyof ActionMap<SubscriptionPayload>];

export const subscriptionsReducer = (
  state: ApiSeries[],
  action: SubscriptionActions
) => {
  switch (action.type) {
    case Types.SetSubscriptions:
      return action.payload.subscriptions;
    case Types.ClearSubscriptions:
      return null;
    default:
      return state;
  }
};
