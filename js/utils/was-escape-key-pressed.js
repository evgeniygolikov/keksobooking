export default function wasEscapeKeyPressed(event) {
  return (
    event.key === 'Escape' ||
    event.key === 'Esc' ||
    event.keyCod === 27
  );
}