import { InitialStateType } from "../../contexts/MainContext";
import { getMyPlaylists } from "../../api/playlist";
import { Types } from "../../contexts/types";
import { UserActions } from "../../contexts/UserReducer";
import { PlaylistActions } from "../../contexts/PlaylistsReducer";
import { SubscriptionActions } from "../../contexts/SubscriptionReducer";
import { SearchActions } from "../../contexts/SearchReducer";

export const fetchPlaylists = async (
  dispatch: React.Dispatch<
    UserActions | PlaylistActions | SubscriptionActions | SearchActions
  >
) => {
  const userPlaylistResults = await getMyPlaylists();
  if (userPlaylistResults) {
    dispatch({
      type: Types.SetPlaylists,
      payload: { playlists: userPlaylistResults },
    });
  }
};
