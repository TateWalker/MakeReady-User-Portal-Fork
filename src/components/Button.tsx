import React, { MouseEvent, ButtonHTMLAttributes } from "react";
import { classnames } from "../lib/utils/classnames";
import { Icon, Icons, IconShapeType } from "./icon";
import { when } from "../lib/utils/when";
import { groupReactChildren } from "../lib/utils/group-react-children";
import { observer } from "mobx-react";

import "./styles/Button.scss";
import Loading from "./Loading";

// Button sizes
export enum IButtonSize {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  XLARGE = "xl",
}

// Button modes
export enum IButtonMode {
  PURPLE = "Button--purple",
  PRIMARY = "Button--primary",
  SECONDARY = "Button--secondary",
  GREY = "Button--grey",
  ICON = "Button--icon",
  ICON_GREY = "Button--icon Button--icon-grey",
  BORDER = "Button--border",
}

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  color?: string;
  size?: IButtonSize;
  children?: React.ReactNode;
  iconShape?: IconShapeType;
  onClick?: (e: MouseEvent) => void;
  borderRadius?: string;
  disabled?: boolean;
  isDark?: boolean;
  className?: string;
  mode?: IButtonMode;
  loading?: boolean;
  transparent?: boolean;
}

const Button = observer(({ ...props }: IProps) => {
  const {
    onClick,
    children,
    iconShape,
    className,
    loading = false,
    transparent = false,
    disabled = false,
    mode = IButtonMode.PRIMARY,
    size = IButtonSize.LARGE,
  } = props;

  const groups = groupReactChildren(props.children);
  const icon = groups.get(Icon);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) {
      return false;
    }
    onClick?.(e);
  };

  const getIconSize = () => {
    switch (size) {
      case IButtonSize.SMALL:
        return 14;
      case IButtonSize.MEDIUM:
        return 20;
      case IButtonSize.LARGE:
        return 24;
      case IButtonSize.XLARGE:
        return 30;
      default:
        return 14;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={classnames(
        className,
        "Button",
        mode,
        loading ? "Button--loading" : "",
        icon ? "Button--contains-icon" : "",
        transparent ? "Button--transparent" : "",
        disabled ? "Button--disabled" : "",
        `Button--size-${size}`
      )}
    >
      {when(
        iconShape,
        <Icon provider={Icons} shape={iconShape} size={getIconSize()} />
      )}
      {when(loading, <Loading />)}
      {when(mode !== IButtonMode.ICON, children)}
    </div>
  );
});

export default Button;
