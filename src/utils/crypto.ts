export function computeBekHash(input: string): string {
  // Deterministic 256-bit hexadecimal hash for Browser Exam Key (BEK)
  const state = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    const pos = i % 8;
    state[pos] = Math.imul(state[pos] ^ code, 0x5bd1e995) >>> 0;
    state[(pos + 1) % 8] = (state[(pos + 1) % 8] + (state[pos] ^ (state[pos] >>> 13))) >>> 0;
  }

  for (let r = 0; r < 8; r++) {
    state[r] = (state[r] ^ (state[(r + 3) % 8] >>> 11)) >>> 0;
  }

  return state.map((v) => v.toString(16).padStart(8, '0')).join('');
}

export function formatTimeSeconds(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const remainingSecs = s % 60;
  return `${String(m).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
}
