import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn(() => null);
    const spy = jest.spyOn(global, 'setTimeout');
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(spy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn(() => null);
    const timeout = 2000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const timeout = 1000;
    const callback = jest.fn(() => null);
    const spy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, timeout);

    expect(spy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 200);

    jest.advanceTimersByTime(800);

    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    (join as jest.Mock).mockReturnValueOnce('');

    await readFileAsynchronously('');

    expect(join).toHaveBeenCalledTimes(1);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValueOnce(false);

    const res = await readFileAsynchronously('');

    expect(res).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const content = 'test content';
    const buffer = Buffer.from(content);

    (existsSync as jest.Mock).mockReturnValueOnce(true);
    (readFile as jest.Mock).mockReturnValueOnce(buffer);

    const res = await readFileAsynchronously('');

    expect(res).toStrictEqual(content);
  });
});
