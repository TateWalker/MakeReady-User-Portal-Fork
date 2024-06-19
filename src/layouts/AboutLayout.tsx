import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import About from "../pages/About";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const AboutLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="AboutLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <About />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default AboutLayout;
