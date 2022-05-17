/** @format */

export default function CardInput({ back }) {
  const bgColor = back ? "bg-red-100" : "bg-blue-100";
  const fontBold = back ? "" : "font-bold";
  return (
    <div
      className={`flex h-48 items-center justify-center rounded-md p-2 drop-shadow-sm sm:h-72 ${bgColor}`}
    >
      <textarea className={`text-center caret-pink-500${fontBold}`} />
    </div>
  );
}
