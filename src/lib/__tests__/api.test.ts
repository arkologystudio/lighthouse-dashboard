import { mapResult, flatMapResult, matchResult } from '../api';
import type { Result, ApiError } from '../../types';

describe('API Utilities', () => {
  describe('mapResult', () => {
    it('transforms successful result data', () => {
      const result: Result<number> = { success: true, data: 5 };
      const mapped = mapResult(result, n => n * 2);

      expect(mapped).toEqual({ success: true, data: 10 });
    });

    it('passes through error result unchanged', () => {
      const error: ApiError = { message: 'Test error' };
      const result: Result<number> = { success: false, error };
      const mapped = mapResult(result, n => n * 2);

      expect(mapped).toEqual({ success: false, error });
    });
  });

  describe('flatMapResult', () => {
    it('chains successful results', () => {
      const result: Result<number> = { success: true, data: 5 };
      const chained = flatMapResult(
        result,
        n =>
          ({
            success: true,
            data: n * 2,
          }) as Result<number>
      );

      expect(chained).toEqual({ success: true, data: 10 });
    });

    it('returns error from first result', () => {
      const error: ApiError = { message: 'Test error' };
      const result: Result<number> = { success: false, error };
      const chained = flatMapResult(
        result,
        n =>
          ({
            success: true,
            data: n * 2,
          }) as Result<number>
      );

      expect(chained).toEqual({ success: false, error });
    });

    it('returns error from chained function', () => {
      const result: Result<number> = { success: true, data: 5 };
      const error: ApiError = { message: 'Chained error' };
      const chained = flatMapResult(
        result,
        () =>
          ({
            success: false,
            error,
          }) as Result<number>
      );

      expect(chained).toEqual({ success: false, error });
    });
  });

  describe('matchResult', () => {
    it('calls success handler for successful result', () => {
      const result: Result<string> = { success: true, data: 'test' };
      const output = matchResult(result, {
        success: data => `Success: ${data}`,
        error: error => `Error: ${error.message}`,
      });

      expect(output).toBe('Success: test');
    });

    it('calls error handler for error result', () => {
      const error: ApiError = { message: 'Test error' };
      const result: Result<string> = { success: false, error };
      const output = matchResult(result, {
        success: data => `Success: ${data}`,
        error: error => `Error: ${error.message}`,
      });

      expect(output).toBe('Error: Test error');
    });
  });
});
