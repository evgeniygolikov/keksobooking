export default function wasEnterKeyPressed(event) {
  return (
    event.key === 'Enter' ||
    event.keyCode === 13
  );
}