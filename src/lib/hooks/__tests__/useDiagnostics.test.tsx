import { renderHook, act, waitFor } from '@testing-library/react';
import { useDiagnostics } from '../useDiagnostics';
import { diagnosticsApi } from '../../api';
import type { DiagnosticReport, DiagnosticPageScore } from '../../../types';

// Mock the diagnostics API
jest.mock('../../api', () => ({
  diagnosticsApi: {
    getSiteScore: jest.fn(),
    getPageScores: jest.fn(),
    triggerRescore: jest.fn(),
  },
  matchResult: (result: { success: boolean; data?: unknown; error?: unknown }, handlers: { success: (data: unknown) => void; error: (error: unknown) => void }) => {
    if (result.success) {
      return handlers.success(result.data);
    } else {
      return handlers.error(result.error);
    }
  },
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('useDiagnostics', () => {
  const mockReport: DiagnosticReport = {
    id: 'report-123',
    site_id: 'site-456',
    overall_score: 85,
    max_possible_score: 100,
    access_intent: 'allow',
    indicators: [
      {
        id: 'llms-txt',
        name: 'llms.txt',
        status: 'pass',
        score: 10,
        max_score: 10,
        why_it_matters: 'Enables AI agents',
        fix_recommendation: 'Already implemented',
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockPageScores: DiagnosticPageScore[] = [
    {
      id: 'page-1',
      site_id: 'site-456',
      url: 'https://example.com/about',
      path: '/about',
      score: 75,
      max_possible_score: 100,
      indicators_summary: {
        pass: 5,
        warn: 2,
        fail: 1,
      },
      last_analyzed_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch diagnostics data on mount', async () => {
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: true,
      data: mockReport,
    });

    const { result } = renderHook(() => useDiagnostics('site-456'));

    expect(result.current.isLoading).toBe(true);
    expect(diagnosticsApi.getSiteScore).toHaveBeenCalledWith('site-456');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.report).toEqual(mockReport);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockError = { message: 'Failed to fetch diagnostics' };
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: false,
      error: mockError,
    });

    const { result } = renderHook(() => useDiagnostics('site-456'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.report).toBeNull();
      expect(result.current.error).toBe('Failed to fetch diagnostics');
    });
  });

  it('should fetch page scores for pro users', async () => {
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: true,
      data: mockReport,
    });
    (diagnosticsApi.getPageScores as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPageScores,
    });

    const { result } = renderHook(() => 
      useDiagnostics('site-456', { fetchPageScores: true })
    );

    await waitFor(() => {
      expect(result.current.pageScores).toEqual(mockPageScores);
      expect(diagnosticsApi.getPageScores).toHaveBeenCalledWith('site-456');
    });
  });

  it('should trigger rescore and refresh data', async () => {
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: true,
      data: mockReport,
    });
    (diagnosticsApi.triggerRescore as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        success: true,
        message: 'Rescore initiated',
        job_id: 'job-123',
        estimated_completion_time: 300,
      },
    });

    const { result } = renderHook(() => useDiagnostics('site-456'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.triggerRescore();
    });

    expect(diagnosticsApi.triggerRescore).toHaveBeenCalledWith('site-456', undefined);
    expect(result.current.isRescoring).toBe(false);
  });

  it('should handle rescore errors', async () => {
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: true,
      data: mockReport,
    });
    (diagnosticsApi.triggerRescore as jest.Mock).mockResolvedValue({
      success: false,
      error: { message: 'Rate limit exceeded' },
    });

    const { result } = renderHook(() => useDiagnostics('site-456'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.triggerRescore();
    });

    expect(result.current.isRescoring).toBe(false);
  });

  it('should poll for updates when polling is enabled', async () => {
    jest.useFakeTimers();
    
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: true,
      data: mockReport,
    });

    const { result } = renderHook(() => 
      useDiagnostics('site-456', { pollingInterval: 5000 })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(diagnosticsApi.getSiteScore).toHaveBeenCalledTimes(1);

    // Advance time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(diagnosticsApi.getSiteScore).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  it('should not fetch if siteId is not provided', () => {
    const { result } = renderHook(() => useDiagnostics(''));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.report).toBeNull();
    expect(diagnosticsApi.getSiteScore).not.toHaveBeenCalled();
  });

  it('should refresh data when refresh function is called', async () => {
    (diagnosticsApi.getSiteScore as jest.Mock).mockResolvedValue({
      success: true,
      data: mockReport,
    });

    const { result } = renderHook(() => useDiagnostics('site-456'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(diagnosticsApi.getSiteScore).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refresh();
    });

    expect(diagnosticsApi.getSiteScore).toHaveBeenCalledTimes(2);
  });
});