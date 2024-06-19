import { ApiSeries } from "../../types/apiResponses";
import { InitialStateType } from "../../contexts/MainContext";
import {
  unsubscribeFromSeries,
  subscribeToSeries,
  getSubscriptions,
} from "../../api/subscriptions";
import { Types } from "../../contexts/types";
import { UserActions } from "../../contexts/UserReducer";
import { PlaylistActions } from "../../contexts/PlaylistsReducer";
import { SubscriptionActions } from "../../contexts/SubscriptionReducer";
import { SearchActions } from "../../contexts/SearchReducer";

export const handleSubscriptionToggle = async (
  series: ApiSeries,
  state: InitialStateType,
  dispatch: React.Dispatch<
    UserActions | PlaylistActions | SubscriptionActions | SearchActions
  >
) => {
  try {
    if (state.user && state.subscriptions) {
      if (state.subscriptions.some((s) => s.id === series.id)) {
        const unsubscribeResults = await unsubscribeFromSeries(series.id);
        if (unsubscribeResults === true) {
          dispatch({
            type: Types.SetSubscriptions,
            payload: {
              subscriptions: state.subscriptions.filter(
                (s) => s.id !== series.id
              ),
            },
          });
        } else {
          console.log("Failed to unsubscribe from series");
        }
      } else {
        const results = await subscribeToSeries(series.id);
        if (results === true) {
          console.log("subscribed");
          dispatch({
            type: Types.SetSubscriptions,
            payload: { subscriptions: [...state.subscriptions, series] },
          });
        } else {
          console.log("Failed to subscribe to series");
        }
      }
    }
  } catch (e) {
    console.log("Failed to toggle series subscription", e);
  }
};

export const fetchSubscriptions = async (
  dispatch: React.Dispatch<
    UserActions | PlaylistActions | SubscriptionActions | SearchActions
  >
) => {
  const subscriptions = await getSubscriptions();
  if (subscriptions) {
    dispatch({
      type: Types.SetSubscriptions,
      payload: { subscriptions },
    });
  }
};
