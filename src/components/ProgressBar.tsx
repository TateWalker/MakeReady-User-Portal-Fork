import React from "react";
import styled from "styled-components";

interface IProps {
  percentage: string;
  color: string;
}

export default function ProgressBar(props: IProps) {
  const { percentage, color } = props;
  return (
    <Wrapper>
      <Bar percentage={percentage} color={color} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  bottom: 0px;
  display: flex;
  width: 100%;
  height: 4px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2); // TODO Convert to var
`;

const Bar = styled.div<IProps>`
  width: ${(props) => props.percentage};
  flex: 1 0 0;
  background: ${(props) => props.color};
`;
