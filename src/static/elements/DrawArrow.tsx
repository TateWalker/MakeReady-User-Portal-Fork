import { observer } from "mobx-react";
import { classnames } from "../../lib/utils/classnames";

import "./DrawArrow.scss";

export enum IDrawArrowColor {
  WHITE = "DrawArrow--white",
  PURPLE = "DrawArrow--purple",
}

export enum IDrawArrowDirection {
  LEFT = "DrawArrow--left",
  DOWN = "DrawArrow--down",
  RIGHT = "DrawArrow--right",
  UP = "DrawArrow--up",
}

interface IProps {
  color?: IDrawArrowColor;
  direction?: IDrawArrowDirection;
  length?: number;
  strokeWidth?: number;
}

const DrawArrow = observer(({ ...props }: IProps) => {
  const {
    color = IDrawArrowColor.PURPLE,
    direction = IDrawArrowDirection.DOWN,
    length = 100,
    strokeWidth = 2,
  } = props;

  // Base width of the arrow
  const width = 20;

  // Generate the arrow's path
  const getPath = () => {
    const half = width / 2;
    const totalLength = length + width;
    const tip = totalLength - half;
    switch (direction) {
      case IDrawArrowDirection.DOWN:
        return `M${half},0 L${half},${totalLength} M${half},${totalLength} L${width},${tip} M${half},${totalLength} L0,${tip}`;
      case IDrawArrowDirection.UP:
        return `M${half},${totalLength} L${half},0 M${half},0 L${width},${half} M${half},0 L0,${half}`;
      case IDrawArrowDirection.LEFT:
        return `M${totalLength},${half} L0,${half} M0,${half} L${half},${width} M0,${half} L${half},0`;
      case IDrawArrowDirection.RIGHT:
        return `M0,${half} L${totalLength},${half} M${totalLength},${half} L${tip},${width} M${totalLength},${half} L${tip},0`;
    }
  };

  // Get the SVG's width
  const getWidth = () => {
    switch (direction) {
      case IDrawArrowDirection.LEFT:
      case IDrawArrowDirection.RIGHT:
        return length + width;
      case IDrawArrowDirection.DOWN:
      case IDrawArrowDirection.UP:
        return width;
    }
  };

  // Get the SVG's height
  const getHeight = () => {
    switch (direction) {
      case IDrawArrowDirection.LEFT:
      case IDrawArrowDirection.RIGHT:
        return width;
      case IDrawArrowDirection.DOWN:
      case IDrawArrowDirection.UP:
        return length + width;
    }
  };

  return (
    <div className={classnames("DrawArrow", color, direction)}>
      <svg
        width={getWidth()}
        height={getHeight()}
        viewBox={`0 0 ${getWidth()} ${getHeight()}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={getPath()} strokeWidth={strokeWidth} />
      </svg>
    </div>
  );
});

export default DrawArrow;
