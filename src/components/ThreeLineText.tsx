import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface IProps {
  title: string;
}

function calculateLines(title: string): string[] {
  let words: string[] = title.split(" ");
  let ranges: number[] = [0.25, 0.5, 0.2];
  let lines: string[] = [];
  let start: number = 0;
  for (let i of ranges) {
    let curRange: number = Math.round(words.length * i);
    let end: number = curRange + start;
    lines.push(words.slice(start, start + curRange).join(" "));
    start = end;
  }
  return lines;
}
export default function ThreeLineText(props: IProps) {
  const { title } = props;
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines(calculateLines(title));
  }, [title]);

  return (
    <TextWrapper>
      <FirstRow>{lines[0]}</FirstRow>
      <SecondRow>{lines[1]}</SecondRow>
      <ThirdRow>{lines[2]}</ThirdRow>
    </TextWrapper>
  );
}

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const SharedText = styled.div`
  color: #fff;
  font-family: Anton;
  font-style: normal;
  font-weight: 400;
  line-height: 80%;
  text-transform: uppercase;
`;

const FirstRow = styled(SharedText)`
  font-size: 30px;
  letter-spacing: -0.6px;
`;

const SecondRow = styled(SharedText)`
  font-size: 50px;
  letter-spacing: -1px;
`;

const ThirdRow = styled(SharedText)`
  font-size: 135px;
  letter-spacing: -2.7px;
`;
