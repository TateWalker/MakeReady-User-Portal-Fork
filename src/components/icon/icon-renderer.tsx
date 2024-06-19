import React from "react";
import { isNumber } from "../../lib/utils/types";

/**
 * The minimal needs for the Icon system to render an icon appropriately.
 */
export type IconGraphic = {
  /** The base width of the graphic (as found in the svg tag on export) */
  baseWidth: number;
  /** The base height of the graphic (as found in the svg tag on export) */
  baseHeight: number;
  /** The pathing for the svg to render the graphic. If multiple sibling elements are needed, use React.Fragment */
  render(color?: string): React.ReactElement;
};

/**
 * Type guard for IconGraphic
 */
export function isIconGraphic(val: any): val is IconGraphic {
  return val && isNumber(val?.baseWidth);
}

export interface IIconRenderer {
  /** Provides a custom class name to the container of this component */
  className?: string;
  /** Props to apply directly to the container div of this component */
  containerProps?: React.SVGProps<SVGSVGElement>;
  /** This is the graphic information for rendering the icon */
  graphic: IconGraphic;
  /** Set the color of the icon */
  color?: string;
  /** Set a custom width of the icon */
  width?: number;
  /** Set a custom height of the icon */
  height?: number;
  /**
   * Makes the max dimension of the icon this size. Imagine a box with each side the length of size. Place the icon in
   * the box, then scale evenly until the icon fits within the box.
   */
  size?: number;
  /** Properties to apply to the encompassing SVG of the icon */
  svgProps?: React.SVGProps<SVGSVGElement>;
}

function updateState(
  options: IIconRenderer,
  base: IconRenderer,
  graphic: IconGraphic
) {
  if (options.size) {
    if (graphic.baseHeight > graphic.baseWidth) {
      options.height = options.size;
    } else {
      options.width = options.size;
    }
  }

  if (options.width && options.height) {
    base.width = options.width;
    base.height = options.height;
  } else {
    // Determine the rendered width and height. This determines if the width or height or width AND height were set.
    // If only one is set, the aspect ratio is used to calculate the other.
    !options.width && !options.height
      ? ((base.width = graphic.baseWidth), (base.height = graphic.baseHeight))
      : !options.width && options.height
      ? ((base.width = options.height * base.aspect),
        (base.height = options.height))
      : !options.height && options.width
      ? ((base.height = options.width / base.aspect),
        (base.width = options.width))
      : null;
  }

  // Apply the color to the state
  base.color = options.color || base.color;

  return base;
}

/**
 * This is a base class intended to help smoothe over confusion of how to custom render an icon.
 */
export class IconRenderer extends React.Component<IIconRenderer> {
  aspect = 1;
  color?: string = void 0;
  height = 0;
  width = 0;

  constructor(props: IIconRenderer) {
    super(props);
    const { graphic } = props;
    this.aspect = graphic.baseWidth / graphic.baseHeight;
  }

  shouldComponentUpdate(
    nextProps: Readonly<IIconRenderer>,
    nextState: Readonly<object>,
    nextContext: any
  ) {
    if (nextProps.graphic !== this.props.graphic) {
      const { graphic } = nextProps;
      this.aspect = graphic.baseWidth / graphic.baseHeight;
    }

    return (
      super.shouldComponentUpdate?.(nextProps, nextState, nextContext) || true
    );
  }

  render() {
    const { className, containerProps, graphic } = this.props;
    const state = updateState(Object.assign({}, this.props), this, graphic);

    return (
      <svg
        width={state.width}
        height={state.height}
        viewBox={`0 0 ${graphic.baseWidth} ${graphic.baseHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...containerProps}
      >
        {graphic.render(state.color)}
      </svg>
    );
  }
}
