import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApiPlaylist as Playlist,
  ApiGetPlaylist as GetPlaylist,
  ApiVideo as Video,
} from "../types/apiResponses";
import Button, { IButtonMode, IButtonSize } from "../components/Button";
import ListVideoCard from "../components/ListVideoCard";
import ActionMenu from "../components/ActionMenu";
import useDelayUnmount from "../hooks/useDelayUnmount";
import ShareModal from "../components/ShareModal";
import { Icon, IconShape, Icons } from "../components/icon";
import { MinBreakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import { Application } from "../store";
import InputField from "../components/InputField";
import { classnames } from "../lib/utils/classnames";
import { observer } from "mobx-react";

import "./styles/Playlist.scss";
import { when } from "../lib/utils/when";
import Loading, { iLoadingColor } from "../components/Loading";

const PlaylistPage = observer(({ ...props }) => {
  const params = useParams();
  const playlistSlug: string = params.linkSlug!;
  const [selectedItem, setSelectedItem] = useState<Video | Playlist | null>(
    null
  );
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareTransitionedIn = useDelayUnmount(isShareOpen, 420);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const isDesktop = useMediaQuery(MinBreakpoints.desktop, "min");
  const isLoggedIn = Application.session.user.isAuthenticated;
  // Load the correct playlist
  Application.ui.playlist.loadPlaylist(playlistSlug);

  // Get the playlist
  const playlist = Application.ui.playlist.selected;
  const videos = Application.ui.playlist.filteredVideos;
  const upNext = Application.ui.playlist.upNext;

  const handleActionToggle = (item: Video | Playlist | null) => {
    setSelectedItem(item);
    setIsActionOpen(true);
  };

  const handleActionClose = () => {
    setIsActionOpen(false);
  };

  const handleOpenShare = () => {
    if (!Application.session.user.isAuthenticated) {
      navigate("/auth");
    } else {
      setIsShareOpen(true);
    }
  };

  const handleFilterItems = (query: string) => {
    setQuery(query);
    Application.ui.playlist.setFilter(query);
  };

  return (
    <div
      className={classnames("Playlist", isActionOpen ? "Playlist--open" : "")}
    >
      <div className={"Playlist__Header"}>
        {when(
          Application.ui.playlist.loading,
          <Loading color={iLoadingColor.DARK} />
        )}
        <div className={"Playlist__Top"}>
          <div className="Playlist__Back">
            <Icon
              provider={Icons}
              shape={IconShape.ARROW_LEFT}
              size={isDesktop ? 24 : 16}
              onClick={() => navigate(-1)}
            />
          </div>
          <h2>{playlist?.name}</h2>
        </div>
        <div className={"Playlist__Bottom"}>
          <div className={"Playlist__Stats"}>
            <div className="Playlist__Stat">
              <span>{videos.length}</span>
              {videos.length !== 1 ? "Videos" : "Video"}
            </div>
          </div>
          <div className={"Playlist__Buttons"}>
            <Button
              mode={IButtonMode.ICON}
              size={IButtonSize.LARGE}
              iconShape={IconShape.SHARE}
              disabled={!isLoggedIn}
              onClick={() => handleOpenShare()}
            ></Button>
            <Button
              mode={IButtonMode.ICON}
              size={IButtonSize.LARGE}
              iconShape={IconShape.DOT_MENU}
              disabled={!isLoggedIn}
              onClick={() => handleActionToggle(playlist)}
            ></Button>
          </div>
        </div>
      </div>
      <div className={"Playlist__Content"}>
        {when(Application.ui.playlist.loading, <Loading />)}
        <InputField
          value={query}
          placeholder={"Filter playlist by title, description"}
          iconShape={IconShape.SEARCH}
          onChange={(e) => handleFilterItems(e.target.value)}
        />
        <div className="Playlist__Videos">
          {videos.map((video: Video, index) => {
            return (
              <ListVideoCard
                key={index}
                playlist={playlist!}
                video={video}
                status={video.isWatched ? "watched" : ""}
                isUpNext={upNext?.id === video.id}
                userPlaylists={userPlaylists}
              />
            );
          })}
        </div>
      </div>
      <ActionMenu
        item={selectedItem}
        isOpen={isActionOpen}
        onClose={() => handleActionClose()}
      />
      <ShareModal
        item={playlist}
        isOpen={shareTransitionedIn ? isShareOpen : shareTransitionedIn}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
});

export default PlaylistPage;
