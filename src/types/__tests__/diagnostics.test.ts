import type {
  DiagnosticIndicator,
  DiagnosticReport,
  DiagnosticPageScore,
  AccessIntent,
  DiagnosticStatus,
  TriggerRescoreRequest,
  TriggerRescoreResponse,
} from '../index';

describe('Diagnostics Types', () => {
  describe('DiagnosticIndicator', () => {
    it('should have correct structure', () => {
      const indicator: DiagnosticIndicator = {
        id: 'llms-txt',
        name: 'llms.txt',
        status: 'pass',
        score: 10,
        max_score: 10,
        why_it_matters: 'Enables AI agents to understand your content boundaries',
        fix_recommendation: 'Add llms.txt file to your root directory',
        details: {
          file_exists: true,
          validation_passed: true,
        },
      };

      expect(indicator.id).toBe('llms-txt');
      expect(indicator.status).toBe('pass');
      expect(indicator.score).toBeLessThanOrEqual(indicator.max_score);
      expect(indicator.why_it_matters.length).toBeLessThanOrEqual(120);
    });

    it('should support all status types', () => {
      const statuses: DiagnosticStatus[] = ['pass', 'warn', 'fail'];
      statuses.forEach((status) => {
        const indicator: DiagnosticIndicator = {
          id: 'test',
          name: 'Test',
          status,
          score: 5,
          max_score: 10,
          why_it_matters: 'Test matters',
          fix_recommendation: 'Fix it',
        };
        expect(indicator.status).toBe(status);
      });
    });
  });

  describe('DiagnosticReport', () => {
    it('should have correct structure', () => {
      const report: DiagnosticReport = {
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

      expect(report.site_id).toBe('site-456');
      expect(report.overall_score).toBeLessThanOrEqual(report.max_possible_score);
      expect(report.indicators).toHaveLength(1);
      expect(report.access_intent).toBe('allow');
    });

    it('should support all access intent types', () => {
      const intents: AccessIntent[] = ['allow', 'partial', 'block'];
      intents.forEach((intent) => {
        const report: DiagnosticReport = {
          id: 'test',
          site_id: 'test',
          overall_score: 50,
          max_possible_score: 100,
          access_intent: intent,
          indicators: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        };
        expect(report.access_intent).toBe(intent);
      });
    });
  });

  describe('DiagnosticPageScore', () => {
    it('should have correct structure', () => {
      const pageScore: DiagnosticPageScore = {
        id: 'page-123',
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
      };

      expect(pageScore.url).toMatch(/^https?:\/\//);
      expect(pageScore.score).toBeLessThanOrEqual(pageScore.max_possible_score);
      expect(pageScore.indicators_summary.pass).toBeGreaterThanOrEqual(0);
      expect(pageScore.indicators_summary.warn).toBeGreaterThanOrEqual(0);
      expect(pageScore.indicators_summary.fail).toBeGreaterThanOrEqual(0);
    });
  });

  describe('TriggerRescoreRequest', () => {
    it('should have correct structure', () => {
      const request: TriggerRescoreRequest = {
        site_id: 'site-123',
        force: true,
      };

      expect(request.site_id).toBe('site-123');
      expect(request.force).toBe(true);
    });
  });

  describe('TriggerRescoreResponse', () => {
    it('should have correct structure', () => {
      const response: TriggerRescoreResponse = {
        success: true,
        message: 'Rescore initiated',
        job_id: 'job-123',
        estimated_completion_time: 300,
      };

      expect(response.success).toBe(true);
      expect(response.job_id).toBe('job-123');
      expect(response.estimated_completion_time).toBeGreaterThan(0);
    });
  });
});