import { classnames } from "../lib/utils/classnames";

import "./styles/DefaultSpinner.scss";

interface IProps {
  isDark?: boolean;
}

export default function DefaultSpinner(props: IProps) {
  const { isDark } = props;
  return (
    <div
      className={classnames(
        "DefaultSpinner",
        isDark ? "DefaultSpinner--dark" : ""
      )}
    />
  );
}
