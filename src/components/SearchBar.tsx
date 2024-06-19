import React from "react";
import InputField from "./InputField";
import { ApiVideo as Video } from "../types/apiResponses";
import { IconShape } from "../components/icon";

interface IProps {
  placeholder: string;
  videoList: Video[];
  setVideoResults: (videos: Video[]) => void;
  isSearching: (isSearching: boolean) => void;
}

export default function SearchBar(props: IProps) {
  const { placeholder, videoList, setVideoResults, isSearching } = props;
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleFilterItems = (query: string) => {
    setSearchQuery(query);
    isSearching(true);
    if (query === "") {
      setVideoResults(videoList);
      isSearching(false);
      return;
    }
    const videoResults = videoList.filter((video) => {
      return (
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase())
      );
    });
    isSearching(false);
    setVideoResults(videoResults);
  };

  return (
    <InputField
      placeholder={placeholder}
      iconShape={IconShape.SEARCH}
      onChange={(e) => handleFilterItems(e.target.value)}
      value={searchQuery}
    />
  );
}
