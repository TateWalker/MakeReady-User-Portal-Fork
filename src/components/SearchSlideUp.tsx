import React, { useEffect, useState } from "react";
import InputField, { IInputFieldMode } from "./InputField";
import ListVideoCard from "./ListVideoCard";
import DefaultSpinner from "./DefaultSpinner";
import { useNavigate } from "react-router-dom";
import { classnames } from "../lib/utils/classnames";
import Button, { IButtonMode, IButtonSize } from "./Button";
import { Icon, IconShape, Icons } from "./icon";
import { Application } from "../store";
import { observer } from "mobx-react";
import SeriesCard from "./SeriesCard";
import { when } from "../lib/utils/when";

import "./styles/SearchSlideUp.scss";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Loading from "./Loading";

interface IProps {
  isOpen?: boolean;
  onClose: () => void;
  onChange?(event?: React.ChangeEvent<HTMLInputElement>): void;
  onStopTyping?(event: React.ChangeEvent<HTMLInputElement>): void;
}

const SearchSlideUp = observer(({ ...props }: IProps) => {
  const navigate = useNavigate();
  const { isOpen = true, onChange, onClose, onStopTyping } = props;

  // Get results
  const results = Application.ui.search.results;

  // Current results type
  const [currentResultType, setCurrentResultType] = useState("videos");

  // Mobile media query
  const isMobile = useMediaQuery(Breakpoints.mobile);

  // Get the current state of the search
  const searchActive = Application.ui.search.active;

  // Search ref
  const searchRef = React.useRef<HTMLInputElement>(null);
  const timeout = React.useRef<number | undefined>();
  const [theValue, setTheValue] = useState(Application.ui.search.query);

  const handleOnClickSeries = (id: number) => {
    Application.ui.search.close();
    Application.ui.menu.close();
    navigate(`/series/${id}`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheValue(event.target.value);
    onChange?.(event);

    // Clear previous timeout and start a new one
    clearTimeout(timeout.current);

    // Wait 200ms before searching
    timeout.current = window.setTimeout(() => {
      Application.ui.search.setQuery(event.target.value);
      Application.ui.search.search();
      onStopTyping?.(event);
    }, 200);
  };

  const renderResultType = () => {
    const results = Application.ui.search.results;
    if (!results) return;
    // Videos
    if (currentResultType === "videos") {
      if (!results.videos.length) return;
      return (
        <>
          {results.videos.map((video, idx) => (
            <ListVideoCard key={idx} video={video}></ListVideoCard>
          ))}
        </>
      );
    }
    // Series
    if (currentResultType === "series") {
      if (!results.series.length) return;
      return (
        <div className={"SeriesCard__Cards"}>
          {results.series.map((series, idx) => {
            if (!series) return;
            return (
              <div
                className={classnames("SearchSlideUp__SeriesView")}
                key={idx}
              >
                <SeriesCard
                  series={series}
                  onClick={() => {
                    handleOnClickSeries(series.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleClickClose = () => {
    onClose?.();
  };

  return (
    <div
      className={classnames(
        "SearchSlideUp",
        isOpen ? "SearchSlideUp--visible" : ""
      )}
      ref={searchRef}
    >
      <div className={"SearchSlideUp__Header"}>
        <div className={"SearchSlideUp__Header__Title"}>
          <h2>Search</h2>
          <Button
            iconShape={IconShape.CLOSE}
            mode={IButtonMode.ICON}
            size={IButtonSize.MEDIUM}
            transparent={true}
            onClick={handleClickClose}
          />
        </div>
        <InputField
          mode={IInputFieldMode.SEARCH}
          autofocus={searchActive}
          value={theValue}
          onChange={handleChange}
          placeholder="Search by Title, Tag, or Category"
        />
        {when(
          !isMobile,
          <div className={"SearchSlideUp__Close"} onClick={onClose}>
            <Icon provider={Icons} shape={IconShape.CLOSE} size={40} />
          </div>
        )}
      </div>
      <div className={"SearchSlideUp__Results"}>
        <div className={"SearchSlideUp__ResultTypes"}>
          <div
            className={classnames(
              "SearchSlideUp__ResultType",
              currentResultType == "videos"
                ? "SearchSlideUp__ResultType--selected"
                : "",
              results?.videos.length > 0
                ? ""
                : "SearchSlideUp__ResultType--disabled"
            )}
            onClick={() => setCurrentResultType("videos")}
          >
            <div>Videos</div>
            <span>{results?.videos.length}</span>
          </div>
          <div
            className={classnames(
              "SearchSlideUp__ResultType",
              currentResultType == "series"
                ? "SearchSlideUp__ResultType--selected"
                : "",
              results?.series?.length > 0
                ? ""
                : "SearchSlideUp__ResultType--disabled"
            )}
            onClick={() => setCurrentResultType("series")}
          >
            <div>Series</div>
            <span>{results?.series.length}</span>
          </div>
        </div>
        <div className={"SearchSlideUp__ResultsList"}>
          {when(Application.ui.search.loading, <Loading />)}
          {renderResultType()}
        </div>
      </div>
    </div>
  );
});

export default SearchSlideUp;
