import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IconBox from "./IconBox";
import Share from "../static/icons/Share";
import Trash from "../static/icons/Trash";
import Edit from "../static/icons/Edit";
import {
  ApiVideo as Video,
  ApiPlaylist as Playlist,
} from "../types/apiResponses";
import { getMyPlaylists, removeVideoFromPlaylist } from "../api/playlist";
import { useNavigate } from "react-router-dom";
import ReusableModal from "./ReusableModal";
import useDelayUnmount from "../hooks/useDelayUnmount";
import Button from "./Button";
import Plus from "../static/icons/Plus";
import Checkbox from "./Checkbox";
interface IProps {
  video: Video;
  playlist: Playlist;
  onAddToPlaylistOpen: () => void;
  onDeleteFromPlaylist: () => void;
  onShareModalOpen: () => void;
}

export default function VideoShareTooltip(props: IProps) {
  const {
    video,
    playlist,
    onAddToPlaylistOpen,
    onDeleteFromPlaylist,
    onShareModalOpen,
  } = props;

  const navigate = useNavigate();

  return (
    <VideoShareTooltipWrapper>
      <TooltipOption onClick={() => onShareModalOpen()}>
        <IconBox>
          <Share fill="#100F12" />
        </IconBox>
        <OptionText>Share this video</OptionText>
      </TooltipOption>
      <TooltipOption onClick={() => onAddToPlaylistOpen()}>
        <IconBox>
          <Edit fill="#100F12" />
        </IconBox>
        <OptionText>Add to a playlist</OptionText>
      </TooltipOption>
      {playlist && (
        <>
          <Line />
          <TooltipOption onClick={() => onDeleteFromPlaylist()}>
            <IconBox>
              <Trash fill="#100F12" />
            </IconBox>
            <OptionText>Remove from playlist</OptionText>
          </TooltipOption>
        </>
      )}
    </VideoShareTooltipWrapper>
  );
}

const VideoShareTooltipWrapper = styled.div`
  display: flex;
  /* padding: 10px 0px; */
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  background: var(--White, #fff);
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.2);
  /* overflow-x: hidden; */
`;

const TooltipOption = styled.div`
  display: flex;
  padding: 10px 20px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  width: auto;
  cursor: pointer;
  align-self: stretch;
  &:hover {
    background: rgba(24, 20, 29, 0.1);
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  opacity: 0.1;
  background: #000;
`;

const OptionText = styled.div`
  color: #18141d;
  font-family: "Open Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
`;
