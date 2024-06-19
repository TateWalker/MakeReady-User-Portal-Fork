import React from "react";
import styled from "styled-components";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip(props: IProps) {
  const { children, className } = props;
  return (
    <TooltipWrapper className={className}>
      <>{children}</>
    </TooltipWrapper>
  );
}

const TooltipWrapper = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  background-color: white;
  text-align: center;
`;
