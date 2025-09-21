export default function Header() {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <input
        type="text"
        placeholder="Search"
        className="border rounded px-4 py-2 w-1/3"
      />
    </div>
  );
}
