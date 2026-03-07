// Shared types used across NatliDashboard and OverviewTab

export interface HealthData {
  status: string;
  timestamp: string;
  alerts: Array<{ level: 'warning' | 'critical' | 'info'; type: string; message: string; timestamp: string }>;
  cpu: number; memory: number; disk: number;
  memTotalGb: number; memUsedGb: number; memAvailGb: number;
  cpuTemp: number; gpuTemp: number; socTemp: number;
  cpuPowerW: number; systemPowerW: number;
  gpuPercent: number; gpuFreqMhz: number;
  netInKbps: number; netOutKbps: number;
  diskReadKbps: number; diskWriteKbps: number;
  thermalState: string; socModel: string;
  coreCount: number; eCores: number; pCores: number;
  services: { openclaw: boolean; ollama: boolean; gateway: boolean };
  topProcesses: Array<{ pid: number; command: string; cpu_percent: number; memory_percent: number; gpu_ms_per_sec?: number }>;
  gatewayReachable: boolean; gatewayLatencyMs: number; gatewayVersion: string; gatewayHost: string;
  gatewayServiceRunning: boolean; gatewayPid: number; gatewayStartTime: string;
  primaryModel: string; totalSessions: number;
  memoryFiles: number; memoryChunks: number; memoryDirty: boolean; memoryDbPath: string;
  ollamaModel: string; cacheEntries: number; vectorEnabled: boolean; ftsEnabled: boolean;
  memoryMdLines: number; memoryMdCap: number; memoryDailyLogs: number; memoryArchiveCount: number;
  memoryDbSizeMb: number; lastMemorySyncTime: string;
  p0Sections: number; p1Sections: number; p2Sections: number;
  [key: string]: unknown;
}

export interface CronJobState {
  nextRunAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: string;
  consecutiveErrors: number;
  [key: string]: unknown;
}

export interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: unknown;
  state: CronJobState;
  [key: string]: unknown;
}

export interface ClickUpTask {
  id: string;
  name: string;
  status: { status: string; color: string };
  priority?: { priority: string; color: string } | null;
  assignees?: Array<{ username: string }>;
  due_date?: string | null;
  date_created?: string;
  [key: string]: unknown;
}

export interface MemoryStats {
  dailyLogs: number;
  archived: number;
  dbSizeMb: number;
  totalFiles: number;
  lastUpdated: string;
  [key: string]: unknown;
}

export interface SessionEntry {
  agent?: string;
  started?: string;
  last_active?: string;
  messages?: number;
  status?: string;
}

export interface EnrichedSession {
  key: string;
  updatedAt: number;
  ageMs: number;
  model: string;
  agentId: string;
  totalTokens: number | null;
  sessionType: string;
  label: string;
  isActive: boolean;
  isRecent: boolean;
  [key: string]: unknown;
}

export interface ModelConfig {
  primary: string;
  fallbacks: string[];
  availableModels: Array<{ id: string; alias: string; label: string }>;
}
