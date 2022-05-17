/** @format */
import Link from "next/link";

export default function Tags({ tags, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags &&
        tags.length > 0 &&
        tags.map((tag, index) => (
          <button
            type="button"
            key={index}
            className="flex items-center rounded-md bg-sky-800 px-4 py-1 text-xs font-semibold text-sky-300"
          >
            <Link href={disabled ? "" : `/tag/${tag.parsed}`}>
              <a>
                <span>{tag.raw}</span>
              </a>
            </Link>
          </button>
        ))}
    </div>
  );
}
