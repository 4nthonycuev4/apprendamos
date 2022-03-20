/** @format */

export default function Card({ card, selected }) {
	const bgColor = selected ? "bg-red-100" : "bg-blue-100";
	const fontBold = selected ? "" : "font-bold";
	return (
		<div
			className={
				"flex h-48 sm:h-72 p-2 justify-center items-center rounded-md drop-shadow-sm " +
				bgColor
			}>
			<h1 className={"text-center " + fontBold}>
				{selected ? card.back : card.front}
			</h1>
		</div>
	);
}
