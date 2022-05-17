/** @format */
export default function Card({ card, selected }) {
  const bgColor = selected ? "bg-red-700" : "bg-orange-600";
  const fontBold = selected ? "font-bold" : "";

  return (
    <div className={bgColor}>
      <div className="flex h-48 items-center justify-center p-2 drop-shadow-sm sm:h-72">
        <h1 className={`whitespace-pre-line text-center ${fontBold}`}>
          {selected ? card.back : card.front}
        </h1>
      </div>
    </div>
  );
}
