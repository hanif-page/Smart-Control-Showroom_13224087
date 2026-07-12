export default function StatusDot({ isOn }) {
  return (
    <span
      className={`w-3 h-3 rounded-full inline-block ${
        isOn ? 'bg-green-500' : 'bg-red-500'
      }`}
    />
  );
}