export default function FastLoading() {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <div className="text-pink-500 text-sm">Memuat...</div>
    </div>
  );
}

export function InstantLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50px]">
      <div className="text-gray-400 text-xs">Loading</div>
    </div>
  );
} 