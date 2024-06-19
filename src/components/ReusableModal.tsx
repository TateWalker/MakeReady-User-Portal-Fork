import React, { useEffect } from "react";
import { classnames } from "../lib/utils/classnames";

import "./styles/Modal.scss";
import { Icon, IconShape, Icons } from "./icon";
import { observer } from "mobx-react";

interface IProps {
  children: React.ReactNode[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ReusableModal = observer(({ ...props }: IProps) => {
  const { children, title, isOpen, onClose, className } = props;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // Run onClose when escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={classnames("Modal", isOpen ? "Modal--open" : "")}>
      <div className={classnames("Modal__Box", className)}>
        <div className={"Modal__Top"}>
          {title}
          <div className="Modal__Close">
            <Icon
              provider={Icons}
              shape={IconShape.CLOSE}
              onClick={onClose}
              size={24}
            />
          </div>
        </div>
        <div className="Modal__Bottom">{children}</div>
      </div>
    </div>
  );
});

export default ReusableModal;
