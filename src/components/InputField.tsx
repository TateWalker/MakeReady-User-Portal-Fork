import React, {
  ChangeEvent,
  ClipboardEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
  useEffect,
} from "react";
import IconBox from "./IconBox";
import { Icon, Icons, IconShapeType } from "./icon";

import { when } from "../lib/utils/when";

import "./styles/InputField.scss";
import { classnames } from "../lib/utils/classnames";
import { observer } from "mobx-react";

export enum IInputFieldMode {
  PRIMARY = "InputField--primary",
  SEARCH = "InputField--search",
}

interface IProps extends HTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onKeyUp?: KeyboardEventHandler<HTMLElement>;
  onPaste?: ClipboardEventHandler<HTMLInputElement>;
  iconShape?: IconShapeType;
  value: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  autofocus?: boolean;
  autocomplete?: "on" | "off";
  inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric";
  type?: "text" | "password" | "email" | "number";
  mode?: IInputFieldMode;
}

const InputField = observer(({ ...props }: IProps) => {
  const {
    icon,
    iconShape,
    placeholder,
    onChange,
    onPaste,
    onKeyDown,
    onKeyUp,
    value,
    autofocus = false,
    error = false,
    disabled = false,
    className,
    inputMode = "text",
    type = "text",
    autocomplete = "off",
    mode = IInputFieldMode.PRIMARY,
  } = props;

  // Manage focus state
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(value ? true : false);
  const [hasError] = React.useState(error);

  // Input ref
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  // Watch for changes to autofocus
  useEffect(() => {
    if (inputRef.current) {
      if (autofocus) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [autofocus]);

  return (
    <div
      className={classnames(
        "InputField",
        className,
        focused ? "InputField--focus" : "",
        hasValue ? "InputField--value" : "",
        icon || iconShape ? "InputField--icon" : "",
        hasError ? "InputField--error" : "",
        mode
      )}
    >
      {when(iconShape, <Icon provider={Icons} shape={iconShape} size={24} />)}
      {when(icon, <IconBox>{icon}</IconBox>)}
      {when(placeholder, <label>{placeholder}</label>)}
      <input
        ref={inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        value={value}
        disabled={disabled}
        onPaste={onPaste}
        inputMode={inputMode}
        autoComplete={autocomplete}
        type={type}
      ></input>
    </div>
  );
});

export default InputField;
