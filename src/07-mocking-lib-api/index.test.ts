import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  test('should create instance with provided base url', async () => {
    const testURL = '/test';

    const mockGet = jest.fn().mockResolvedValue({ test: 'test data' });

    const mockAxiosInstance: Partial<AxiosInstance> = {
      get: mockGet,
    };

    const createSpy = jest
      .spyOn(axios, 'create')
      .mockReturnValue(mockAxiosInstance as AxiosInstance);
    const axiosGetSpy = jest.spyOn(axios, 'get');

    await throttledGetDataFromApi(testURL);

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(createSpy).toHaveBeenLastCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(axiosGetSpy).not.toHaveBeenCalled();
  });

  test('should perform request to correct provided url', async () => {
    const testURL = '/test';

    const mockGet = jest.fn().mockResolvedValue({ test: 'test data' });

    const mockAxiosInstance: Partial<AxiosInstance> = {
      get: mockGet,
    };

    jest
      .spyOn(axios, 'create')
      .mockReturnValue(mockAxiosInstance as AxiosInstance);
    const axiosGetSpy = jest.spyOn(axios, 'get');

    await throttledGetDataFromApi(testURL);

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(mockGet).toHaveBeenCalledWith(testURL);
    expect(axiosGetSpy).not.toHaveBeenCalled();
  });

  test('should return response data', async () => {
    const testURL = '/test';
    const testData = { data: { test: 'test data' } };

    const mockGet = jest.fn().mockResolvedValue(testData);

    const mockAxiosInstance: Partial<AxiosInstance> = {
      get: mockGet,
    };

    jest
      .spyOn(axios, 'create')
      .mockReturnValue(mockAxiosInstance as AxiosInstance);
    const axiosGetSpy = jest.spyOn(axios, 'get');

    const res = await throttledGetDataFromApi(testURL);

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(res).toStrictEqual(testData.data);
    expect(axiosGetSpy).not.toHaveBeenCalled();
  });
});
