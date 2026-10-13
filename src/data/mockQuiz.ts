import { SebConfig, QuizQuestion } from '../types/seb';
import { computeBekHash } from '../utils/crypto';

export const DEFAULT_SEB_CONFIG: SebConfig = {
  startUrl: 'https://moodle.exam-portal.edu/mod/quiz/attempt.php?attempt=84021&cmid=418',
  quitPassword: 'q',
  adminPassword: 'admin',
  allowUserToQuit: true,
  taskbarPosition: 'bottom',
  showTaskbar: true,
  showReloadButton: true,
  showClock: true,
  showBattery: true,
  showAudio: true,
  showKeyboardLayout: true,
  showCalculator: true,
  showNotepad: true,
  showPdfViewer: true,
  kioskMode: 'full',
  blockClipboard: true,
  blockContextMenu: true,
  detectWindowBlur: true,
  blockDevTools: true,
  maxViolations: 3,
  browserExamKey: computeBekHash('SEB_DEFAULT_POLICY_V3_7_0'),
  configKey: computeBekHash('SEB_CONFIG_KEY_HASH_STABLE'),
  whitelistedUrls: [
    'https://moodle.exam-portal.edu',
    'https://moodle.exam-portal.edu/*',
    'https://cdn.exam-portal.edu/*',
    'https://safeexambrowser.org'
  ]
};

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    title: 'Operating Systems: Kernel Page Table Isolation (KPTI)',
    category: 'Memory Management & Kernel Security',
    maxPoints: 20,
    type: 'choice',
    prompt:
      'Kernel Page Table Isolation (KPTI) was introduced into modern operating system kernels to defend against speculative execution side-channel attacks like Meltdown. How does KPTI separate memory address spaces between user mode and kernel mode?',
    codeSnippet: `// x86_64 CR3 Register switch on interrupt/syscall:
SWITCH_TO_KERNEL_CR3:
  movq %rsp, %gs:kernel_stack
  movq %cr3, %rax
  andq $(~KPTI_USER_MASK), %rax
  movq %rax, %cr3`,
    options: [
      {
        id: 'opt1',
        text: 'It completely removes the kernel memory space mapping while executing in user mode (Ring 3), keeping only a minimal trampoline shadow page table to handle syscall transitions.'
      },
      {
        id: 'opt2',
        text: 'It encrypts all kernel memory pages on each clock cycle using Intel AES-NI hardware registers.'
      },
      {
        id: 'opt3',
        text: 'It converts all virtual memory page walks into segmented base-offset addressing without using the Translation Lookaside Buffer (TLB).'
      },
      {
        id: 'opt4',
        text: 'It disables CPU multi-core hyperthreading globally during any kernel space context transition.'
      }
    ],
    correctOptions: ['opt1']
  },
  {
    id: 'q2',
    number: 2,
    title: 'Computer Networks: TCP Congestion Control & Window Scaling',
    category: 'Transport Layer Protocols',
    maxPoints: 25,
    type: 'multi_choice',
    prompt:
      'Which of the following statements regarding TCP Reno/Cubic Congestion Control and TCP Window Scaling (RFC 7323) are TRUE? (Select all that apply)',
    options: [
      {
        id: 'opt2a',
        text: 'The TCP Window Scale option in the SYN header allows the 16-bit window field to be shifted up to 14 bits, yielding a maximum receive window of up to ~1 Gigabyte.'
      },
      {
        id: 'opt2b',
        text: 'In Fast Retransmit, receiving 3 duplicate ACKs (DUPACKs) triggers immediate retransmission of the missing segment without waiting for the retransmission timer to expire.'
      },
      {
        id: 'opt2c',
        text: 'TCP Cubic increases the congestion window linearly with round-trip time regardless of the time elapsed since the last packet loss event.'
      },
      {
        id: 'opt2d',
        text: 'TCP Slow Start exponentially doubles the Congestion Window (cwnd) every Round Trip Time until cwnd reaches the slow-start threshold (ssthresh).'
      }
    ],
    correctOptions: ['opt2a', 'opt2b', 'opt2d']
  },
  {
    id: 'q3',
    number: 3,
    title: 'Distributed Systems: Token Bucket Rate Limiter Algorithm',
    category: 'Algorithms & Distributed Systems',
    maxPoints: 30,
    type: 'code',
    prompt:
      'Implement the JavaScript function `evaluateRequests(timestamps, ratePerSec, capacity)` for a Token Bucket rate limiter. Initially the bucket is full with `capacity` tokens. At any arrival timestamp `t`, new tokens are refilled at `ratePerSec * (t - lastTimestamp)` up to `capacity`. Each allowed request consumes 1 token. Return the total number of allowed requests across the sequence.',
    starterCode: `function evaluateRequests(timestamps, ratePerSec, capacity) {
  if (timestamps.length === 0) return 0;
  
  let tokens = capacity;
  let lastTime = timestamps[0];
  let allowed = 0;
  
  for (let i = 0; i < timestamps.length; i++) {
    const t = timestamps[i];
    const elapsed = t - lastTime;
    tokens = Math.min(capacity, tokens + elapsed * ratePerSec);
    lastTime = t;
    
    if (tokens >= 1) {
      tokens -= 1;
      allowed++;
    }
  }
  
  return allowed;
}`,
    testCases: [
      {
        input: '([0, 0, 0, 1, 2], 1, 2)',
        expected: '4',
        label: 'Bucket capacity 2 with burst of 3 at t=0 (2 allowed), then arrivals at t=1,2'
      },
      {
        input: '([0, 0, 0, 0], 2, 2)',
        expected: '2',
        label: 'Burst of 4 at same second: only 2 allowed due to capacity 2'
      },
      {
        input: '([10, 20, 30], 1, 1)',
        expected: '3',
        label: 'Sparse arrivals spaced 10s apart with capacity 1'
      }
    ]
  },
  {
    id: 'q4',
    number: 4,
    title: 'Computer Security: Cryptographic Key Exchange & Ephemeral Diffie-Hellman',
    category: 'Applied Cryptography & TLS 1.3',
    maxPoints: 25,
    type: 'essay',
    minWords: 30,
    prompt:
      'Explain the concept of "Forward Secrecy" (PFS) in modern TLS 1.3 handshakes. Contrast Ephemeral Diffie-Hellman (DHE/ECDHE) with legacy RSA key transport, and explain why compromising a server\'s long-term private key in TLS 1.3 cannot decrypt past recorded sessions.'
  }
];
