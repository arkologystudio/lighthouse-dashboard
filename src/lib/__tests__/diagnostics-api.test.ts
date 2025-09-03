import { diagnosticsApi } from '../api';
import type { DiagnosticReport, DiagnosticPageScore, TriggerRescoreResponse } from '../../types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the auth token functions
jest.mock('js-cookie', () => ({
  get: jest.fn(() => 'mock-token'),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('diagnosticsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getSiteScore', () => {
    it('should fetch site diagnostics report successfully', async () => {
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
            why_it_matters: 'Enables AI agents to understand your content',
            fix_recommendation: 'Already implemented',
          },
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: mockReport }),
      });

      const result = await diagnosticsApi.getSiteScore('site-456');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockReport);
        expect(result.data.site_id).toBe('site-456');
        expect(result.data.overall_score).toBe(85);
      }

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.lighthousestudios.xyz/v1/sites/site-456/score',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ success: false, error: 'Site not found' }),
      });

      const result = await diagnosticsApi.getSiteScore('invalid-site');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Site not found');
        expect(result.error.code).toBe('404');
      }
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await diagnosticsApi.getSiteScore('site-456');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Network error');
        expect(result.error.code).toBe('NETWORK_ERROR');
      }
    });
  });

  describe('getPageScores', () => {
    it('should fetch page-level scores successfully', async () => {
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
        {
          id: 'page-2',
          site_id: 'site-456',
          url: 'https://example.com/contact',
          path: '/contact',
          score: 90,
          max_possible_score: 100,
          indicators_summary: {
            pass: 7,
            warn: 1,
            fail: 0,
          },
          last_analyzed_at: '2024-01-01T00:00:00Z',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: mockPageScores }),
      });

      const result = await diagnosticsApi.getPageScores('site-456');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].url).toBe('https://example.com/about');
        expect(result.data[1].score).toBe(90);
      }

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.lighthousestudios.xyz/v1/pages?site_id=site-456',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });
  });

  describe('triggerRescore', () => {
    it('should trigger rescore successfully', async () => {
      const mockResponse: TriggerRescoreResponse = {
        success: true,
        message: 'Rescore initiated',
        job_id: 'job-789',
        estimated_completion_time: 300,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: mockResponse }),
      });

      const result = await diagnosticsApi.triggerRescore('site-456', true);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.job_id).toBe('job-789');
        expect(result.data.estimated_completion_time).toBe(300);
      }

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.lighthousestudios.xyz/v1/sites/site-456/trigger-rescore',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ site_id: 'site-456', force: true }),
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });

    it('should handle rate limit errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ 
          success: false, 
          error: 'Rate limit exceeded. Please wait before requesting another rescore.' 
        }),
      });

      const result = await diagnosticsApi.triggerRescore('site-456');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Rate limit exceeded');
        expect(result.error.code).toBe('429');
      }
    });
  });
});