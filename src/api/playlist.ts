import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";
import {
  ApiGetPlaylist as GetPlaylist,
  ApiPlaylist as Playlist,
  ApiMyPlaylists as MyPlaylists,
  ApiCreatePlaylist as CreatePlaylist,
  ApiAddToPlaylist as AddToPlaylist,
  ApiRemoveFromPlaylist as RemoveFromPlaylist,
  ApiDeletePlaylist as DeletePlaylist,
  ApiRenamePlaylist as RenamePlaylist,
} from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const getPlaylist = async (
  playlistSlug: string
): Promise<GetPlaylist> => {
  try {
    const response: AxiosResponse<GetPlaylist> = await axios.get(
      `${baseUrl}/playlist/playlist/${playlistSlug}`
    );
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const getMyPlaylists = async (): Promise<Playlist[]> => {
  try {
    const response: AxiosResponse<MyPlaylists> = await axios.get(
      `${baseUrl}/playlist/my_playlists`
    );
    return response.data.playlists;
  } catch (error) {
    return [];
    // throw new Error((error as AxiosError).message);
  }
};

export const createPlaylist = async (name: string): Promise<Playlist> => {
  try {
    const response: AxiosResponse<CreatePlaylist> = await axios.post(
      `${baseUrl}/playlist/create`,
      {
        name,
      }
    );
    return response.data.playlist;
  } catch (error) {
    return {} as Playlist;
  }
};

export const addVideoToPlaylist = async (
  playlistId: number,
  videoId: number,
  order: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<AddToPlaylist> = await axios.post(
      `${baseUrl}/playlist/add_video`,
      {
        playlistId,
        videoId,
        order,
      }
    );
    return true;
  } catch (error) {
    console.error("Failed to add video to playlist", error);
    return false;
  }
};
export const renamePlaylist = async (
  token: string,
  playlistId: number,
  name: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<RenamePlaylist> = await axios.put(
      `${baseUrl}/playlist/playlist/${playlistId}`,
      {
        name,
      },
      { headers: { Authorization: token } }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};
export const removeVideoFromPlaylist = async (
  playlistId: number,
  videoId: number
): Promise<RemoveFromPlaylist> => {
  try {
    const response: AxiosResponse<RemoveFromPlaylist> = await axios.post(
      `${baseUrl}/playlist/remove_video`,
      {
        playlistId,
        videoId,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const deletePlaylist = async (
  token: string,
  playlistId: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<DeletePlaylist> = await axios.delete(
      `${baseUrl}/playlist/playlist/${playlistId}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};
