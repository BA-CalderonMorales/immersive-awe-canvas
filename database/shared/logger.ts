/**
 * Shared Logging Utilities for Consistent Logging
 * @module DatabaseLogger
 * @description Provides a centralized logging mechanism with different log levels
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Logger class for consistent and configurable logging
 */
export class Logger {
  private static instance: Logger;
  private currentLogLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  /**
   * Get singleton instance of Logger
   * @returns Logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set the current log level
   * @param level - Log level to set
   */
  public setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  /**
   * Create a log entry with consistent formatting
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional context information
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (this.shouldLog(level)) {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        context
      };

      switch (level) {
        case LogLevel.ERROR:
          console.error(JSON.stringify(logEntry));
          break;
        case LogLevel.WARN:
          console.warn(JSON.stringify(logEntry));
          break;
        case LogLevel.INFO:
          console.log(JSON.stringify(logEntry));
          break;
        case LogLevel.DEBUG:
          console.debug(JSON.stringify(logEntry));
          break;
      }
    }
  }

  /**
   * Determine if a log should be output based on current log level
   * @param level - Log level to check
   * @returns Boolean indicating if the log should be output
   */
  private shouldLog(level: LogLevel): boolean {
    const logLevels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG
    ];

    const currentIndex = logLevels.indexOf(this.currentLogLevel);
    const levelIndex = logLevels.indexOf(level);

    return levelIndex <= currentIndex;
  }

  /**
   * Log an error message
   * @param message - Error message
   * @param context - Optional error context
   */
  public error(
    message: string,
    context?: Record<string, unknown>
  ): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log a warning message
   * @param message - Warning message
   * @param context - Optional warning context
   */
  public warn(
    message: string,
    context?: Record<string, unknown>
  ): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an info message
   * @param message - Info message
   * @param context - Optional info context
   */
  public info(
    message: string,
    context?: Record<string, unknown>
  ): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a debug message
   * @param message - Debug message
   * @param context - Optional debug context
   */
  public debug(
    message: string,
    context?: Record<string, unknown>
  ): void {
    this.log(LogLevel.DEBUG, message, context);
  }
}