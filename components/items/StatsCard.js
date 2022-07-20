/** @format */

import { useEffect, useState } from "react";
import {
    AnnotationIcon as AnnotationIconOutline,
    BookmarkIcon as BookmarkIconOutline,
    HeartIcon as HeartIconOutline,
} from "@heroicons/react/outline";
import {
    AnnotationIcon as AnnotationIconSolid,
    BookmarkIcon as BookmarkIconSolid,
    HeartIcon as HeartIconSolid,
} from "@heroicons/react/solid";

export default function StatsCard({
    contentRef,
    stats,
    viewerStats = { like: false, comments: 0, saved: false },
}) {
    const [xstats, setStats] = useState(stats);
    const [xviewerStats, setViewerStats] = useState(viewerStats);

    return s;
}
