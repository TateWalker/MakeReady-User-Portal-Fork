import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface IProps {
  checked: boolean;
  onChange: (isChecked: boolean) => void;
  className?: string;
}

export default function Checkbox(props: IProps) {
  const { checked, onChange, className } = props;
  const [isChecked, setIsChecked] = useState(checked);
  const handleOnChange = () => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  };
  return (
    <CheckboxContainer className={className}>
      <HiddenCheckbox checked={isChecked} />
      <StyledCheckbox checked={isChecked} onClick={() => handleOnChange()}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  );
}

const CheckboxContainer = styled.div`
  display: flex;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;
// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })<{
  checked: boolean;
}>`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${(props) => (props.checked ? "#6C47FF" : "#FFF")};
  border-radius: 3px;
  border: 1px solid #6c47ff;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px pink;
  }

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`;
