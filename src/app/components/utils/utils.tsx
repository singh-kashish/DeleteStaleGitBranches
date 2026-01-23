export function P({
  text,
  style,
}: {
  text: string;
  style: string;
}) {
  return <p className={style}>{text}</p>;
}
