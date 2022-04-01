/** @format */

export default function CardInput({ back }) {
	const bgColor = back ? "bg-red-100" : "bg-blue-100";
	const fontBold = back ? "" : "font-bold";
	return (
		<div
			className={
				"flex h-48 sm:h-72 p-2 justify-center items-center rounded-md drop-shadow-sm " +
				bgColor
			}>
			<textarea className={"text-center caret-pink-500" + fontBold}></textarea>
		</div>
	);
}
