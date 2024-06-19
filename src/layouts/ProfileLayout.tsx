import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import Profile from "../pages/Profile";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const ProfileLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="ProfileLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <Profile />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default ProfileLayout;
