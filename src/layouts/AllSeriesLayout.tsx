import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AllSeries from "../pages/AllSeries";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const AllSeriesLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="AllSeriesLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <AllSeries />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default AllSeriesLayout;
