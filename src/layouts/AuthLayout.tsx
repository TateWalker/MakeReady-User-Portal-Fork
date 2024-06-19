import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import Auth from "../pages/Auth";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const AuthLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="AuthLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <Auth />
        <Footer />
      </ScrollView>
    </div>
  );
});

export default AuthLayout;
