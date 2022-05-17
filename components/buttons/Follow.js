export default function FollowButton({ following = false }) {
  if (following) {
    return (
      <button
        type="button"
        className="h-6 w-20 rounded bg-black text-xs font-semibold"
      >
        No seguir
      </button>
    );
  }
  return (
    <button
      type="button"
      className="h-6 w-20 rounded bg-red-600 text-xs font-semibold "
    >
      Seguir
    </button>
  );
}
