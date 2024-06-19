import styled from "styled-components";
import {
  ApiPlaylist as Playlist,
  ApiSeries as Series,
} from "../types/apiResponses";
import { useNavigate } from "react-router-dom";
import DefaultSpinner from "./DefaultSpinner";
import { observer } from "mobx-react";

import "./styles/MyPlaylistsList.scss";
import { classnames } from "../lib/utils/classnames";
import Loading from "./Loading";
import { when } from "../lib/utils/when";

interface IProps {
  title: string;
  data: Playlist[] | Series[];
  isLoading: boolean;
}

const MyPlaylistsList = observer(({ ...props }: IProps) => {
  const { title, data, isLoading } = props;

  const navigate = useNavigate();

  const handleNav = (item: Playlist | Series) => {
    if ("linkSlug" in item) {
      navigate(`/playlist/${item.linkSlug}`);
    } else {
      navigate(`/series/${item.id}`);
    }
  };
  return (
    <div className={classnames("MyPlaylistList")}>
      {when(isLoading, <Loading />)}
      <div className="MyPlaylistList__Title">{title}</div>
      <div className="MyPlaylistList__Items">
        {data.length > 0 &&
          data.map((item: Playlist | Series, index: number) => {
            return (
              <div
                className={"MyPlaylistList__Item"}
                key={index}
                onClick={() => handleNav(item)}
              >
                <div>{item.name}</div>
                <span>{item.videoCount || 0}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default MyPlaylistsList;
