import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import FeaturedPage from "../pages/FeaturedPage";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const FeaturedLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="FeaturedLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <FeaturedPage />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default FeaturedLayout;
