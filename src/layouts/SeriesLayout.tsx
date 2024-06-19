import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoSeries from "../pages/VideoSeries";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const SeriesLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="SeriesLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <VideoSeries />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default SeriesLayout;
