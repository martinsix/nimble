import { useState, useEffect, useMemo } from 'react';
import { LogEntry } from '@/lib/types/log-entries';
import { getActivityLog } from '@/lib/services/service-factory';

export interface UseActivityLogReturn {
  logEntries: LogEntry[];
  addLogEntry: (entry: LogEntry) => void;
  handleClearRolls: () => Promise<void>;
}

export function useActivityLog(): UseActivityLogReturn {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  
  // Get service from factory (memoized)
  const activityLogService = useMemo(() => getActivityLog(), []);

  // Subscribe to activity log updates
  useEffect(() => {
    const refreshLogs = async () => {
      try {
        const entries = await activityLogService.getLogEntries();
        setLogEntries(entries);
      } catch (error) {
        console.error("Failed to refresh log entries:", error);
      }
    };

    // Initial load and periodic refresh (simple polling)
    refreshLogs();
    const interval = setInterval(refreshLogs, 1000);

    return () => clearInterval(interval);
  }, [activityLogService]);

  const addLogEntry = (entry: LogEntry) => {
    setLogEntries(prevEntries => [entry, ...prevEntries.slice(0, 99)]); // Keep only 100 entries
  };

  const handleClearRolls = async () => {
    try {
      await activityLogService.clearLogEntries();
      setLogEntries([]);
    } catch (error) {
      console.error("Failed to clear log entries:", error);
    }
  };

  return {
    logEntries,
    addLogEntry,
    handleClearRolls,
  };
}