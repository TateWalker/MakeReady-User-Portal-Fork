import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import MyPlaylists from "../pages/MyPlaylists";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const MyPlaylistsLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="MyPlaylistsLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <MyPlaylists />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default MyPlaylistsLayout;
