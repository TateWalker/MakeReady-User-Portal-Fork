import React from "react";
import styled from "styled-components";
import InputField from "./InputField";

interface IProps {
  digits: string;
  setDigits: (digits: string) => void;
}

export default function OTP(props: IProps) {
  const { digits, setDigits } = props;
  const validationPattern = /[0-9]{1}/;

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text/plain");
    setDigits(pasted.substring(0, 6));
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    const current = e.currentTarget;
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      const prev = current.previousElementSibling as HTMLInputElement | null;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }

    if (e.key === "ArrowRight") {
      const prev = current.nextSibling as HTMLInputElement | null;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const elem = e.target;
    const val = e.target.value;
    // check if the value is valid
    if (!validationPattern.test(val) && val !== "") return;

    // change the value of the upper state using onChange
    const valueArr = digits.split("");
    valueArr[index] = val;
    const newVal = valueArr.join("").slice(0, 6);
    setDigits(newVal);

    //focus the next element if there's a value
    if (val) {
      const next = elem.nextElementSibling as HTMLInputElement | null;
      next?.focus();
    }
  };
  const arr = new Array(6).fill("-");
  return (
    <Wrapper>
      {arr.map((_, index) => (
        <DigitInput
          key={index}
          value={digits.at(index) ?? ""}
          onChange={(e) => handleInputChange(e, index)}
          onPaste={(e) => onPaste(e)}
          onKeyUp={handleKeyUp}
          inputMode="numeric"
        ></DigitInput>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-content: center;
  gap: 4px;
  align-self: center;
`;

const DigitInput = styled.input`
  display: flex;
  height: 36px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  width: 36px;
  /* flex: 1 0 0; */
  border: 2px solid rgba(24, 20, 29, 0.1);
  background: rgba(24, 20, 29, 0.1);

  color: var(--Dark, #18141db3);
  font-family: Open Sans;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 80%; /* 19.2px */
  letter-spacing: -0.72px;
  text-align: center;
`;
