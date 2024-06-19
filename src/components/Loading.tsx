import { classnames } from "../lib/utils/classnames";
import { when } from "../lib/utils/when";
import { observer } from "mobx-react";

import "./styles/Loading.scss";

// Button sizes
export enum IButtonSize {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  XL = "xl",
}

// Button modes
export enum iLoadingColor {
  TRANSPARENT = "Loading--color-transparent",
  LIGHT = "Loading--color-light",
  DARK = "Loading--color-dark",
}

// Enum for button mode
export enum ILoadingMode {
  SPINNER = "spinner",
  DOTS = "dots",
}

interface IProps {
  className?: string;
  mode?: ILoadingMode;
  color?: iLoadingColor;
}

const Loading = observer(({ ...props }: IProps) => {
  const {
    className,
    mode = ILoadingMode.SPINNER,
    color = iLoadingColor.TRANSPARENT,
  } = props;

  return (
    <div
      className={classnames("Loading", `Loading--${mode}`, color, className)}
    >
      {when(
        mode === ILoadingMode.SPINNER,
        <div className="Loading__Spinner"></div>
      )}
      {when(
        mode === ILoadingMode.DOTS,
        <div className="Loading__Dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>
  );
});

export default Loading;
