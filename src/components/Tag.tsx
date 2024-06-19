import "./styles/Tag.scss";

interface IProps {
  text?: string;
  onClick?: () => void;
}

export default function Tag(props: IProps) {
  const { text, onClick } = props;
  return (
    <a className={"Tag"} onClick={() => onClick?.()}>
      {text}
    </a>
  );
}
