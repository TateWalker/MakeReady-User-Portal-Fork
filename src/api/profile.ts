import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";
import {
  ApiProfile as Profile,
  ApiUpdateProfile as UpdateProfile,
  ApiChangeNotification as ChangeNotification,
} from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const getSelf = async (): Promise<Profile> => {
  try {
    const response: AxiosResponse<Profile> = await axios.get(
      `${baseUrl}/profile/self`
    );
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const updateProfile = async (
  profileName?: string,
  profileZipCode?: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<UpdateProfile> = await axios.post(
      `${baseUrl}/profile/update_profile`,
      {
        profileName: profileName,
        profileZipCode: profileZipCode,
      }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const changeNotification = async (
  token: string
): Promise<ChangeNotification> => {
  try {
    const response: AxiosResponse<ChangeNotification> = await axios.post(
      `${baseUrl}/profile/change_notification`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};
