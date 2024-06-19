import React from "react";
import Button, { IButtonMode, IButtonSize } from "../components/Button";
import MyPlaylistsList from "../components/MyPlaylistsList";
import useDelayUnmount from "../hooks/useDelayUnmount";
import ReusableModal from "../components/ReusableModal";
import InputField from "../components/InputField";
import { Icon, IconShape, Icons } from "../components/icon";
import { Application } from "../store";
import { observer } from "mobx-react";
import { classnames } from "../lib/utils/classnames";

import "./styles/MyPlaylists.scss";

const MyPlaylists = observer(({ ...props }) => {
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = React.useState(false);
  const [newPlaylistName, setNewPlaylistName] = React.useState("");
  const addPlaylistTransitionedIn = useDelayUnmount(isAddPlaylistOpen, 420);

  // Get data
  const playlists = Application.ui.playlist.all;
  const subscriptions = Application.ui.subscription.all;

  // Close new playlist modal
  const handleCloseAddPlaylist = () => {
    setIsAddPlaylistOpen(false);
    setNewPlaylistName("");
  };

  // Create playlist
  const handleCreatePlaylist = async () => {
    Application.ui.playlist.create(newPlaylistName);
    handleCloseAddPlaylist();
  };

  const renderAddPlaylistModal = () => {
    return (
      <ReusableModal
        isOpen={
          addPlaylistTransitionedIn
            ? isAddPlaylistOpen
            : addPlaylistTransitionedIn
        }
        onClose={handleCloseAddPlaylist}
        title="Create a new playlist"
      >
        <div className="Modal__Content">
          <InputField
            placeholder="Playlist Name"
            autofocus={true}
            value={newPlaylistName}
            onChange={(e) => {
              setNewPlaylistName(e.target.value);
            }}
          ></InputField>
        </div>
        <div className={"Modal__Buttons"}>
          <Button
            size={IButtonSize.XLARGE}
            mode={IButtonMode.PURPLE}
            onClick={handleCreatePlaylist}
          >
            Create Playlist
          </Button>
        </div>
      </ReusableModal>
    );
  };

  return (
    <div className={classnames("MyPlaylists")}>
      <div className={"MyPlaylists__Header"}>
        <h2>Manage Playlists</h2>
        <div className={"MyPlaylists__Stats"}>
          <div className="MyPlaylists__Stat">
            <span>{Application.ui.playlist.count}</span>
            {Application.ui.playlist.count <= 1 ? "Playlist" : "Playlists"}
          </div>
          <div className="MyPlaylists__Stat">
            <span>{Application.ui.playlist.videoCount}</span>
            {Application.ui.playlist.videoCount <= 1 ? "Video" : "Videos"}
          </div>
        </div>
      </div>
      <div className={"MyPlaylists__Body"}>
        <Button
          onClick={() => setIsAddPlaylistOpen(true)}
          size={IButtonSize.XLARGE}
          mode={IButtonMode.PRIMARY}
        >
          <Icon provider={Icons} shape={IconShape.ADD} size={20} />
          New Playlist
        </Button>
        <div className={"MyPlaylists__Wrapper"}>
          <MyPlaylistsList
            title="My Playlists"
            data={playlists}
            isLoading={Application.ui.playlist.loading}
          ></MyPlaylistsList>
          <MyPlaylistsList
            title="Subscribed"
            data={subscriptions}
            isLoading={Application.ui.subscription.loading}
          ></MyPlaylistsList>
        </div>
      </div>
      {(addPlaylistTransitionedIn || isAddPlaylistOpen) &&
        renderAddPlaylistModal()}
    </div>
  );
});

export default MyPlaylists;
