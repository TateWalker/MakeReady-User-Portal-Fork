import { useRouteError } from "react-router";
import styled from "styled-components";
import { Breakpoints, useMediaQuery } from "./lib/hooks/useMediaQuery";
export default function NotFound() {
  const error: any = useRouteError();
  console.error(error);

  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <ErrorPageWrapper id="error-page" isMobile={isMobile}></ErrorPageWrapper>
  );
}

const ErrorPageWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  padding-top: 70px;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${(props) =>
    props.isMobile ? "404-mobile.png" : "404.png"});
  background-size: cover;
  background-position: center center;
`;
