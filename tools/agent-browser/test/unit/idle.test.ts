import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { IdleTimer } from '../../src/idle.js';

const IDLE_MS = 1000;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// req: agent-browser/TR-6
test('fires_after_idle', () => {
  const onIdle = vi.fn();
  new IdleTimer(IDLE_MS, onIdle);

  vi.advanceTimersByTime(IDLE_MS - 1);
  expect(onIdle).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);

  expect(onIdle).toHaveBeenCalledTimes(1);
});

test('activity_resets', () => {
  const onIdle = vi.fn();
  const timer = new IdleTimer(IDLE_MS, onIdle);
  vi.advanceTimersByTime(IDLE_MS - 1);

  timer.begin();
  vi.advanceTimersByTime(IDLE_MS);
  expect(onIdle).not.toHaveBeenCalled();
  timer.end();
  vi.advanceTimersByTime(IDLE_MS - 1);

  expect(onIdle).not.toHaveBeenCalled();
  expect(timer.remainingMs()).toBe(1);
});

test('holds_while_in_flight', () => {
  const onIdle = vi.fn();
  const timer = new IdleTimer(IDLE_MS, onIdle);

  timer.begin();
  timer.begin();
  timer.end();
  vi.advanceTimersByTime(IDLE_MS * 10);

  expect(onIdle).not.toHaveBeenCalled();
  expect(timer.remainingMs()).toBeNull();
});

test('rearms_when_in_flight_reaches_zero', () => {
  const onIdle = vi.fn();
  const timer = new IdleTimer(IDLE_MS, onIdle);
  timer.begin();
  timer.begin();
  timer.end();

  timer.end();
  vi.advanceTimersByTime(IDLE_MS);

  expect(onIdle).toHaveBeenCalledTimes(1);
});

test('stop_cancels', () => {
  const onIdle = vi.fn();
  const timer = new IdleTimer(IDLE_MS, onIdle);
  timer.begin();

  timer.stop();
  timer.end();
  vi.advanceTimersByTime(IDLE_MS * 10);

  expect(onIdle).not.toHaveBeenCalled();
  expect(timer.remainingMs()).toBeNull();
});
