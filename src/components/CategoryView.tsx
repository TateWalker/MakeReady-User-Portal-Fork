import React from "react";
import styled from "styled-components";
import ProgressBar from "./ProgressBar";

interface IProps {
  image: string;
  percentage: string;
}

export default function CategoryView(props: IProps) {
  const { image, percentage } = props;
  return (
    <Wrapper image={image}>
      <ProgressBar color="#FF3A69" percentage={percentage} />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ image: string }>`
  display: flex;
  flex-direction: column;
  height: 302px;
  min-width: 170px;
  justify-content: flex-end;
  background-image: url(${(props) => props.image});
  background-size: cover;
`;
