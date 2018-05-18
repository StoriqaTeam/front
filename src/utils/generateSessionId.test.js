import { generateSessionId } from 'utils';

describe('generating correct ID for backend', () => {
  it('should work correct', () => {
    for (let i = 0; i < 10000; i++) {
    const result = generateSessionId();
    expect(result).toBeLessThan(Math.pow(2, 31));
    expect(result).toBeGreaterThan(Math.pow(2, 30));
  }
  });
})
