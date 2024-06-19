import React, { MouseEvent, ButtonHTMLAttributes } from "react";
import { classnames } from "../lib/utils/classnames";
import { observer } from "mobx-react";

import "./styles/TitleStack.scss";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  title: string;
}

/**
 * Create stacked title text
 */
const TitleStack = observer(({ ...props }: IProps) => {
  const { title, className } = props;

  // Get number of slices based on title length
  const getSlices = (title: string): number[] => {
    if (title.length < 30) {
      return [0.6, 0.8];
    }
    if (title.length < 100) {
      return [0.4, 0.6, 0.8];
    }
    return [0.3, 0.5, 0.7, 0.9];
  };

  const getLines = (text: string): string[] => {
    const words: string[] = [];
    let lastIndex = 0;

    // First remove the last word from the text
    text = text.trim();
    const slices = getSlices(text);

    // Get word count
    const wordCount = text.split(" ").length;

    // Split the text by the slices provided
    for (let i = 0; i <= text.length; i++) {
      const percentOfTitle = i / text.length;
      const char = text.charAt(i);
      for (let s = 0; s <= slices.length; s++) {
        const sliceAt = slices[s];
        if (char === " " && percentOfTitle >= sliceAt) {
          words.push(text.slice(lastIndex, i).trim());
          lastIndex = i;
        }
      }
      // The end
      if (i === text.length) {
        words.push(text.slice(lastIndex, i).trim());
      }
    }

    // If there is only one line but multiple words, split it up
    if (words.length === 1 && wordCount > 1) {
      const lastSpace = words[0].lastIndexOf(" ");
      words.push(words[0].slice(lastSpace).trim());
      words[0] = words[0].slice(0, lastSpace).trim();
    }

    return words;
  };

  // Get the lines
  const lines = getLines(title);

  return (
    <div
      className={classnames(
        "TitleStack",
        className,
        `TitleStack__Lines${lines.length}`
      )}
    >
      {lines.map((line, index) => {
        return (
          <div key={index} className="TitleStack__Line">
            {line}
          </div>
        );
      })}
    </div>
  );
});

export default TitleStack;
