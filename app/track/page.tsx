import type { Metadata } from "next";
import TrackView from "@/components/TrackView";

export const metadata: Metadata = { title: "Track order" };

export default function TrackPage() {
  return <TrackView />;
}
