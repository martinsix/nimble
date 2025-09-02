"use client";

import { ActivityLog } from "@/components/activity-log";
import { useActivityLog } from "@/lib/hooks/use-activity-log";

export default function LogPage() {
  const { logEntries, handleClearRolls } = useActivityLog();

  return <ActivityLog entries={logEntries} onClearRolls={handleClearRolls} />;
}
