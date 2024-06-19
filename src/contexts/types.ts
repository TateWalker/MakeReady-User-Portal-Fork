export enum Types {
  SetPlaylists = "PLAYLISTS_SET",
  ClearPlaylists = "PLAYLISTS_CLEAR",
  SetUser = "USER_SET",
  ClearUser = "USER_CLEAR",
  SetSubscriptions = "SUBSCRIPTIONS_SET",
  ClearSubscriptions = "SUBSCRIPTIONS_CLEAR",
  ToggleSearch = "SEARCH_TOGGLE",
  CloseSearch = "SEARCH_CLOSE",
  QuerySearch = "SEARCH_QUERY",
}

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
