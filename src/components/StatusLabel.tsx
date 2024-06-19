import React from "react";
import styled, { css } from "styled-components";

interface IProps {
  status: string | undefined;
  color: "blue" | "purple" | "purpleLight" | "muted";
}

export default function StatusLabel(props: IProps) {
  const { status, color } = props;
  return status !== "" ? (
    <StatusLabelWrapper color={color}>
      <Status color={color}>{status}</Status>
    </StatusLabelWrapper>
  ) : (
    <></>
  );
}

const StatusLabelWrapper = styled.div<{ color: IProps["color"] }>`
  ${(props) => props.color && COLORS[props.color]}
  display: flex;
  padding: 4px;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  /* min-width: 80px; */
`;

const Status = styled.div<{ color: string }>`
  font-family: "Open Sans";
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 10px; /* 100% */
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const COLORS = {
  blue: css`
    color: #7286af;
    background: #e3eeff;
  `,
  purple: css`
    background: #6c47ff;
    color: #fff;
  `,
  purpleLight: css`
    color: #6c47ff;
    background: rgba(108, 71, 255, 0.2);
  `,
  muted: css`
    color: #18141d;
    background: rgba(24, 20, 29, 0.1);
  `,
};
