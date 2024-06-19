import React, {
  ChangeEvent,
  HTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
} from "react";
import styled from "styled-components";
import IconBox from "./IconBox";

interface IProps extends HTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  value: string;
}

export default function MultilineInputField({ ...props }: IProps) {
  const { placeholder, onChange, onKeyDown, value } = props;
  return (
    <InputWrapper>
      <Input
        id="inputField"
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
      ></Input>
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  align-items: flex-start;
  height: 160px;
  align-self: stretch;
  background: #e8e7e8;
`;

const Input = styled.textarea`
  color: #18141d4d;
  resize: none;
  width: 100%;
  height: 100%;
  font-family: "Open Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 166.667% */
  background: transparent;
  border: 0;
  &:focus-visible {
    outline: 0;
  }
`;
