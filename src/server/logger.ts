export interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class MetricsRegistry {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();

  inc(metricName: string, value = 1) {
    const current = this.counters.get(metricName) || 0;
    this.counters.set(metricName, current + value);
  }

  setGauge(metricName: string, value: number) {
    this.gauges.set(metricName, value);
  }

  getSnapshot() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      timestamp: new Date().toISOString(),
    };
  }
}

export const metrics = new MetricsRegistry();

export function log(level: LogEvent['level'], message: string, context?: Record<string, any>) {
  const payload: LogEvent = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
  };

  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(payload));
  } else {
    const ctxStr = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${payload.timestamp}] [${level.toUpperCase()}] ${message}${ctxStr}`);
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, any>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, any>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, any>) => log('error', msg, ctx),
  debug: (msg: string, ctx?: Record<string, any>) => log('debug', msg, ctx),
};
