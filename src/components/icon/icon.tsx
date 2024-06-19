import React from "react";
import { classnames } from "../../lib/utils/classnames";
import { DOMRectBounds } from "../../lib/utils/clone-client-rect";
import { IconGraphic, IconRenderer, IIconRenderer } from "./icon-renderer";
import "./icon.scss";

/**
 * An object type capable of being a valid Icon Lookup.
 */
export type IconProvider = { [key: number]: IconGraphic };

/**
 * Customization options for an icon
 */
export interface IIcon {
  /** Valid children of this icon is simply an icon renderer */
  children?: IconGraphic;
  /**
   * A provider that can provide an Icon Renderer from a specified and selected
   * number
   */
  provider?: IconProvider;
  /** Applies a class to the top level container of the icon */
  className?: string;
  /** Applies a css color to the icon; by default this will be "currentColor" which inherits the parent node's "color" CSS value */
  color?: string;
  /** Props to apply directly to the container div of this component */
  containerProps?: React.HTMLProps<HTMLDivElement>;
  /** Provides alternative root for the tooltip if provided */
  customModalRoot?: HTMLElement;
  /** Sets a dedicated height to the icon */
  height?: number;
  /** Sets a color for the icon when hovered by the mouse */
  hoverColor?: string;
  /**
   * Source of an image to use as an icon. The image will be rendered as a
   * circle where the center of the image is the center of the circle. The size
   * of the circle will be the max(width, height) of the input
   */
  image?: string;
  /**
   * Specifies which icon to render. This number should correlate with the
   * lookup keys in the iconProvider
   */
  shape?: number;
  /** Sets a dedicated width to the icon */
  width?: number;
  /**
   * Sets a max size to accommodate. If the icon base width is greater than the
   * base height then the width will be this size. If the base height is
   * greater, then the height will be this size.
   *
   * If there are alignment issues with the icon when you use this property, try
   * setting "compact" to true.
   */
  size?: number;
  /**
   * Occasionally, flexbox can not handle certain scenarios which will cause
   * using the "size" prop to create slight misalignments that arise from auto
   * aspect ratio calculations alongside flex box. Set this to true to try and
   * resolve the issue. Otherwise, you may need to use custom CSS.
   */
  compact?: boolean;

  onClick?(e: React.MouseEvent): void;
}

interface IState {
  hovered: boolean;
  box?: DOMRectBounds | null;
}

/**
 * A one stop shop for rendering any of the used icons in the system
 */
export class Icon extends React.Component<IIcon, IState> {
  state: IState = {
    hovered: false,
  };

  imageRef = React.createRef<HTMLImageElement>();
  containerRef = React.createRef<HTMLDivElement>();

  onLoad = () => {
    const { width: iconWidth, height: iconHeight, size: iconSize } = this.props;
    const size = iconSize || Math.max(iconWidth || 0, iconHeight || 0);
    const image = this.imageRef.current;
    if (!image) return;
    const { width, height } = image;

    image.style.marginLeft = `${-(width - size) / 2}px`;
    image.style.marginTop = `${-(height - size) / 2}px`;
  };

  render() {
    const { hovered } = this.state;

    const {
      className,
      color,
      containerProps = {},
      shape,
      image,
      width,
      height,
      size: iconSize,
      onClick,
      hoverColor,
      provider: iconProvider,
      compact,
    } = this.props;

    // Render as an image
    if (image) {
      const size = iconSize || Math.max(width || 0, height || 0);

      return (
        <div
          className={classnames("Icon", className)}
          onClick={onClick}
          {...containerProps}
        >
          <div className="Icon--circle" style={{ width: size, height: size }}>
            <img
              ref={this.imageRef}
              className="Icon__Image"
              src={image}
              onLoad={this.onLoad}
              alt=""
            />
          </div>
        </div>
      );
    }

    // Render the icon as an icon graphic
    let graphic: IconGraphic | undefined = this.props.children;

    if (shape !== void 0 && iconProvider) {
      graphic = iconProvider[shape];
    }

    if (!graphic) return null;

    const props: IIconRenderer = {
      color: hovered ? hoverColor || color || undefined : color || undefined,
      width: iconSize ? undefined : this.props.width,
      height: iconSize ? undefined : this.props.height,
      size: this.props.size,
      graphic,
    };

    const styleWidth = iconSize && !compact ? iconSize : width;
    const styleHeight = iconSize && !compact ? iconSize : height;

    return (
      <div
        ref={this.containerRef}
        className={classnames("Icon", className)}
        style={{ height: styleHeight, width: styleWidth }}
        onClick={onClick}
        {...containerProps}
      >
        <IconRenderer {...props} />
      </div>
    );
  }
}
