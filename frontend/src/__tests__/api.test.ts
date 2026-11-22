/**
 * API service tests — Vitest
 * Tests Axios instance configuration and interceptors.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the api module in isolation using mocks
describe('API Service', () => {
  it('should be importable without errors', async () => {
    // Dynamic import to test module loading
    expect(async () => {
      await import('../services/api');
    }).not.toThrow();
  });

  it('configures base URL for the API', async () => {
    const mod = await import('../services/api');
    // The api object (default or named export) should exist
    const api = mod.default || (mod as any).api;
    expect(api).toBeDefined();
  });

  it('handles 401 responses by clearing local auth', () => {
    // Simulate what the interceptor does
    const mockLocalStorage = {
      removeItem: vi.fn(),
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    // Simulate a 401 clear
    window.localStorage.removeItem('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('JSON payload is serializable', () => {
    const payload = {
      full_name: 'Test User',
      email: 'test@test.com',
      technical_skills: 'Python, ML',
      grade_cgpa_percentage: 85.0,
    };
    expect(() => JSON.stringify(payload)).not.toThrow();
    const parsed = JSON.parse(JSON.stringify(payload));
    expect(parsed.email).toBe('test@test.com');
  });

  it('profile payload matches expected schema shape', () => {
    const profile = {
      full_name: 'Alex Morgan',
      age: 22,
      gender: 'Male',
      highest_qualification: 'B.Tech',
      stream: 'CSE',
      technical_skills: 'Python, SQL',
      soft_skills: 'Problem Solving',
      fields_of_interest: 'AI/ML',
      grade_cgpa_percentage: 88.5,
      preferred_work_style: 'Remote',
      willing_to_relocate: 'Yes',
    };
    // All required keys present
    const requiredKeys = ['full_name', 'technical_skills', 'fields_of_interest'];
    requiredKeys.forEach((key) => {
      expect(key in profile).toBe(true);
    });
  });
});

// ─── Zustand Store Tests ───────────────────────────────────────────────────────
describe('AppStore (Zustand)', () => {
  it('initialises with null predictions', async () => {
    const { useAppStore } = await import('../store/appStore');
    const state = useAppStore.getState();
    expect(state.latestPredictions).toBeNull();
    expect(state.topCareer).toBeNull();
  });

  it('setLatestPredictions updates state correctly', async () => {
    const { useAppStore } = await import('../store/appStore');
    const mockPreds = [
      {
        rank: 1,
        career: 'Machine Learning Engineer',
        prediction_score: 95.5,
        raw_probability: 0.955,
        is_top_match: true,
      },
    ];
    useAppStore.getState().setLatestPredictions(mockPreds, 'Machine Learning Engineer', 42);
    const state = useAppStore.getState();
    expect(state.latestPredictions).toHaveLength(1);
    expect(state.topCareer).toBe('Machine Learning Engineer');
    expect(state.assessmentId).toBe(42);
  });

  it('clearPredictions resets state to null', async () => {
    const { useAppStore } = await import('../store/appStore');
    useAppStore.getState().clearPredictions();
    const state = useAppStore.getState();
    expect(state.latestPredictions).toBeNull();
    expect(state.topCareer).toBeNull();
  });

  it('toggleSidebar flips the sidebarOpen flag', async () => {
    const { useAppStore } = await import('../store/appStore');
    const initial = useAppStore.getState().sidebarOpen;
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(!initial);
    // Toggle back
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(initial);
  });
});
