import React from "react";
import { observer } from "mobx-react";

import { ScrollView } from "../components/scroll-view/scroll-view";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import Navbar from "../components/Navbar";
import ErrorPage from "../ErrorPage";
import Give from "../pages/Give";
import Footer from "../components/Footer";

interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const ErrorLayout = observer(({ ...props }: IProps) => {
  const { children } = props;

  // Check mobile for native scroll
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className="ErrorLayout">
      <Navbar />
      <ScrollView nativeScroll={isMobile}>
        <ErrorPage />
      </ScrollView>
    </div>
  );
});

export default ErrorLayout;
