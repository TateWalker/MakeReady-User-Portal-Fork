import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import PlaylistPage from "../pages/PlaylistPage";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const PlaylistLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="PlaylistLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <PlaylistPage />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default PlaylistLayout;
