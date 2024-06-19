import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { media } from "../styles/media";
import { Icon, IconShape, Icons } from "./icon";

interface IProps {
  children: React.ReactNode;
  title: string;
  viewAllText: string;
  path: string;
}

export default function Carousel(props: IProps) {
  const { children, title, viewAllText, path } = props;
  const navigate = useNavigate();
  return (
    <CarouselWrapper>
      <CarouselHeader>
        <CarouselTitle>{title}</CarouselTitle>
        <ViewAll onClick={() => navigate(path)}>
          <ViewAllText>{viewAllText}</ViewAllText>
          <Icon provider={Icons} shape={IconShape.ARROW_RIGHT} size={10} />
        </ViewAll>
      </CarouselHeader>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </CarouselWrapper>
  );
}

const CarouselHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const SharedText = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-size: 14px;
  color: #18141d;
`;

const CarouselTitle = styled(SharedText)`
  font-weight: 700;
  line-height: 140%;
  text-transform: capitalize;
`;
const ViewAllText = styled(SharedText)`
  font-weight: 400;
  line-height: 20px;
`;
const ViewAll = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
`;

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChildrenWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  gap: 10px;
  overflow-x: scroll;
`;
