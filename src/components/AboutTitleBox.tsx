import React from "react";
import styled from "styled-components";
import { media } from "../styles/media";
import DrawArrow from "../static/elements/DrawArrow";

interface IProps {
  title: string;
  isDark?: boolean;
}
export default function AboutTitleBox(props: IProps) {
  const { title, isDark } = props;
  return (
    <TitleBoxWrapper>
      <TitleBox isDark={isDark}>
        <TitleText isDark={isDark}>{title}</TitleText>
      </TitleBox>
      <DrawArrow />
    </TitleBoxWrapper>
  );
}

const TitleBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleBox = styled.div<{ isDark?: boolean }>`
  display: flex;
  padding: 20px 40px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border: 2px solid ${(props) => (props.isDark ? "#F5F5F5" : "#6C47FF")};
  ${media.desktop} {
    padding: 40px;
  }
`;

const TitleText = styled.div<{ isDark?: boolean }>`
  color: ${(props) => (props.isDark ? "#F5F5F5" : "#18141D")};
  font-family: Anton;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 80px; /* 200% */
  letter-spacing: -0.8px;
  text-transform: uppercase;
  ${media.desktop} {
    font-size: 80px;
  }
`;
