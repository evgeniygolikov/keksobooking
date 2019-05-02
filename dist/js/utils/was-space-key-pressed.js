export default function wasSpaceKeyPressed(event) {
  return (
    event.key === 'Space' ||
    event.keyCode === 32
  );
}