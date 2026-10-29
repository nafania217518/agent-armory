// Fires onIdle once the daemon has had no request in flight for idleMs.
export class IdleTimer {
  private active = 0;
  private handle: NodeJS.Timeout | null = null;
  private armedAt = 0;
  private stopped = false;

  constructor(
    private readonly idleMs: number,
    private readonly onIdle: () => void,
  ) {
    // A fresh daemon has no request in flight.
    this.arm();
  }

  begin(): void {
    this.active += 1;
    this.disarm();
  }

  end(): void {
    this.active -= 1;
    if (this.active === 0 && !this.stopped) this.arm();
  }

  /** Requests that arrived and have not finished, queued ones included. */
  get inFlight(): number {
    return this.active;
  }

  stop(): void {
    this.stopped = true;
    this.disarm();
  }

  remainingMs(): number | null {
    if (this.handle === null) return null;
    return Math.max(0, this.armedAt + this.idleMs - Date.now());
  }

  private arm(): void {
    this.disarm();
    this.armedAt = Date.now();
    this.handle = setTimeout(() => {
      this.handle = null;
      this.onIdle();
    }, this.idleMs);
    // The timer alone must not keep the process alive.
    this.handle.unref();
  }

  private disarm(): void {
    if (this.handle === null) return;
    clearTimeout(this.handle);
    this.handle = null;
  }
}
