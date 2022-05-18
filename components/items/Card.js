/** @format */
export default function Card({ card, selected }) {
  const bgColor = selected ? "bg-red-500" : "bg-blue-600";
  const fontBold = selected ? "font-bold" : "";

  return (
    <div className={bgColor}>
      <div className="flex h-48 items-center justify-center p-2 drop-shadow-sm sm:h-72">
        <h1 className={`whitespace-pre-line text-white text-center ${fontBold}`}>
          {selected ? card.back : card.front}
        </h1>
      </div>
    </div>
  );
}
