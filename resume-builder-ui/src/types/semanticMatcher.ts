/**
 * Shared types for the semantic keyword matcher worker protocol.
 */

// --- Worker message protocol ---

export interface WorkerInitMessage {
  type: 'init';
}

export interface WorkerMatchMessage {
  type: 'match';
  resumeText: string;
  jobDescription: string;
}

export type WorkerInMessage = WorkerInitMessage | WorkerMatchMessage;

export interface WorkerProgressMessage {
  type: 'init:progress';
  progress: number; // 0-100
  status: string;
}

export interface WorkerReadyMessage {
  type: 'init:ready';
}

export interface WorkerErrorMessage {
  type: 'error';
  error: string;
}

export interface WorkerResultMessage {
  type: 'match:result';
  result: EnhancedScanResult;
}

export type WorkerOutMessage =
  | WorkerProgressMessage
  | WorkerReadyMessage
  | WorkerErrorMessage
  | WorkerResultMessage;

// --- Result types ---

export type SemanticMatchType = 'exact' | 'semantic' | 'partial' | 'none';

export interface EnhancedKeywordResult {
  keyword: string;
  found: boolean;
  similarity: number; // 0-1 cosine similarity
  matchType: SemanticMatchType;
  bestMatchContext?: string; // Best-matching resume sentence
  suggestedPlacement?: string;
  category?: string;
}

export interface EnhancedScanResult {
  matchPercentage: number;
  totalKeywords: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  matched: EnhancedKeywordResult[];
  partial: EnhancedKeywordResult[];
  missing: EnhancedKeywordResult[];
}

// --- Hook state ---

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';
