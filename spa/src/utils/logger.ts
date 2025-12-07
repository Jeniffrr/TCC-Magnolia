type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  userId?: string;
  data?: unknown;
  error?: {
    message: string;
    stack?: string;
    code?: string | number;
  };
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry, null, this.isDevelopment ? 2 : 0);
  }

  private createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : undefined;

    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      userId,
      data,
    };
  }

  info(message: string, context?: string, data?: unknown): void {
    const entry = { ...this.createEntry('info', message), context, data };
    console.log(this.formatLog(entry));
  }

  warn(message: string, context?: string, data?: unknown): void {
    const entry = { ...this.createEntry('warn', message), context, data };
    console.warn(this.formatLog(entry));
  }

  error(message: string, error: unknown, context?: string): void {
    const errorData = error as { message?: string; stack?: string; response?: { status?: number } };
    const entry = {
      ...this.createEntry('error', message),
      context,
      error: {
        message: errorData.message || 'Unknown error',
        stack: this.isDevelopment ? errorData.stack : undefined,
        code: errorData.response?.status,
      },
    };
    console.error(this.formatLog(entry));
  }

  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      const entry = this.createEntry('debug', message, data);
      console.debug(this.formatLog(entry));
    }
  }
}

export const logger = new Logger();

class PerformanceMonitor {
  private timers: Map<string, number> = new Map();

  start(name: string): void {
    this.timers.set(name, performance.now());
  }

  end(name: string, context?: string): void {
    const startTime = this.timers.get(name);
    if (!startTime) return;
    
    const duration = Math.round(performance.now() - startTime);
    this.timers.delete(name);
    
    if (duration > 1000) {
      logger.warn('Operação lenta', context || 'Performance', { name, duration });
    } else {
      logger.debug('Métrica', { name, duration });
    }
  }

  async measure<T>(name: string, fn: () => Promise<T>, context?: string): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name, context);
      return result;
    } catch (error) {
      this.end(name, context);
      throw error;
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
