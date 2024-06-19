import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";
import { ApiFeaturedTag as FeaturedTag } from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const getFeaturedTags = async (): Promise<FeaturedTag[]> => {
  try {
    const response: AxiosResponse = await axios.get(`${baseUrl}/featured/tag`);
    return response.data.tags;
  } catch (error) {
    return [];
  }
};
