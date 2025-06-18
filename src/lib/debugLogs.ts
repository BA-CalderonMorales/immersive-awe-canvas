
interface DebugAttempt {
  timestamp: string;
  issue: string;
  attemptedFix: string;
  result: string;
  notes?: string;
}

class DebugLogger {
  private attempts: DebugAttempt[] = [];

  logAttempt(issue: string, attemptedFix: string, result: string, notes?: string) {
    const attempt: DebugAttempt = {
      timestamp: new Date().toISOString(),
      issue,
      attemptedFix,
      result,
      notes
    };
    
    this.attempts.push(attempt);
    console.log('🔍 Debug Attempt Logged:', attempt);
  }

  getAttempts(): DebugAttempt[] {
    return [...this.attempts];
  }

  getAttemptsForIssue(issue: string): DebugAttempt[] {
    return this.attempts.filter(attempt => attempt.issue.includes(issue));
  }

  printSummary() {
    console.log('📋 Debug Attempts Summary:');
    this.attempts.forEach((attempt, index) => {
      console.log(`${index + 1}. [${attempt.timestamp}] ${attempt.issue}`);
      console.log(`   Fix: ${attempt.attemptedFix}`);
      console.log(`   Result: ${attempt.result}`);
      if (attempt.notes) {
        console.log(`   Notes: ${attempt.notes}`);
      }
      console.log('');
    });
  }
}

export const debugLogger = new DebugLogger();

// Log our previous attempts
debugLogger.logAttempt(
  "Letter 'M' key not working for keyboard shortcuts",
  "Added comprehensive console logging to trace event flow",
  "Still investigating - logs show event is captured but may not be reaching the right handler",
  "Console logs show KeyboardEventHandler receives 'M' key events but need to verify full call chain"
);

debugLogger.logAttempt(
  "TypeScript error in useKeyboardDebug.ts",
  "Fixed type checking for event.target by using instanceof Element",
  "Fixed - TypeScript error resolved",
  "Error was: Property 'tagName' does not exist on type 'EventTarget'"
);
