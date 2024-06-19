import React, { MutableRefObject, SetStateAction } from "react";
import styled, { css } from "styled-components";
import { media } from "../styles/media";
import { classnames } from "../lib/utils/classnames";

interface IProps {
  size?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
  className?: string;
  ref?: MutableRefObject<HTMLElement | null>;
}

export default function IconBox(props: IProps) {
  const { size, children, onClick, className } = props;
  return (
    <IconWrapper
      size={size}
      onClick={onClick}
      className={classnames("IconBox", className)}
    >
      {children}
    </IconWrapper>
  );
}

const IconWrapper = styled.div<IProps>`
  display: flex;
  width: ${(props) => (props.size ? props.size : "30px")};
  height: ${(props) => (props.size ? props.size : "30px")};
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.onClick ? "pointer" : "inherit")};
`;
