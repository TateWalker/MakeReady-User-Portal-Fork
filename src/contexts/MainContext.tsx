import React, { createContext, useReducer, Dispatch } from "react";
import { UserActions, userReducer } from "./UserReducer";
import { PlaylistActions, playlistsReducer } from "./PlaylistsReducer";
import {
  SubscriptionActions,
  subscriptionsReducer,
} from "./SubscriptionReducer";
import { SearchActions, searchReducer } from "./SearchReducer";
import { ApiPlaylist, ApiProfile, ApiSeries } from "../types/apiResponses";

export type InitialStateType = {
  user: ApiProfile | null;
  playlists: ApiPlaylist[] | null;
  subscriptions: ApiSeries[] | null;
  searchOpen: boolean;
};

const initialState = {
  user: null,
  playlists: null,
  subscriptions: null,
  searchOpen: false,
};

const MainContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<
    UserActions | PlaylistActions | SubscriptionActions | SearchActions
  >;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  { user, playlists, subscriptions, searchOpen }: InitialStateType,
  action: UserActions | PlaylistActions | SubscriptionActions | SearchActions
) => ({
  // @ts-ignore
  user: userReducer(user, action),
  // @ts-ignore
  playlists: playlistsReducer(playlists, action),
  // @ts-ignore
  subscriptions: subscriptionsReducer(subscriptions, action),
  // @ts-ignore
  searchOpen: searchReducer(searchOpen, action),
});

const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainProvider, MainContext };
