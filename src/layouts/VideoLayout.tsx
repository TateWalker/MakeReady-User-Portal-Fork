import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import VideoPage from "../pages/VideoPage";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const VideoLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="VideoLayout">
      <Navbar />
      <ScrollView nativeScroll={true}>
        <VideoPage />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default VideoLayout;
