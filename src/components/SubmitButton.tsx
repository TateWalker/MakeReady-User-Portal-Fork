import React from "react";
import { classnames } from "../lib/utils/classnames";
import { when } from "../lib/utils/when";
import { observer } from "mobx-react";

import "./styles/SubmitButton.scss";
import Loading from "./Loading";

export enum ISubmitButtonMode {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

interface ISubmitButton {
  className?: string;
  label?: string;
  width?: string;
  color?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  mode?: ISubmitButtonMode;
  loading?: boolean;
}

const SubmitButton = observer(({ ...props }: ISubmitButton) => {
  const {
    children,
    disabled = false,
    className,
    label = "Submit",
    mode = ISubmitButtonMode.PRIMARY,
    loading = false,
  } = props;

  return (
    <div
      className={classnames(
        className,
        "SubmitButton",
        mode === ISubmitButtonMode.PRIMARY ? "SubmitButton--primary" : "",
        mode === ISubmitButtonMode.SECONDARY ? "SubmitButton--secondary" : ""
      )}
    >
      {when(loading, <Loading />)}
      <input type="submit" disabled={disabled} value={label} />
    </div>
  );
});

export default SubmitButton;
