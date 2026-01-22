type PProps = {
  text: string;
  style: string;
};

export function P({ text, style }: PProps) {
  return <p className={style}>{text}</p>;
}
