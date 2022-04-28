/** @format */

import { useState, useEffect } from "react";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";

import { AnnotationIcon as AnnotationIconSolid } from "@heroicons/react/solid";
import { AnnotationIcon as AnnotationIconOutline } from "@heroicons/react/outline";

import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";

export default function StatsCard({
	contentRef,
	stats,
	viewerStats = { like: false, comments: 0, saved: false },
}) {
	const [xstats, setStats] = useState(stats);
	const [xviewerStats, setViewerStats] = useState(viewerStats);

	return s;
}
