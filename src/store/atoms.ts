import { atom } from 'jotai';

export type InputType = 'link' | 'text' | 'image';

export interface LogicalFallacy {
  type: string;
  text: string;
  explanation: string;
}

export interface Source {
  name: string;
  url: string;
  is_supporting: boolean;
}

export interface VisualAnalysis {
  is_manipulated: boolean;
  description: string;
}

export interface AnalysisResult {
  truth_score: number;
  verdict_category: string;
  summary: string;
  visual_analysis: VisualAnalysis;
  logical_fallacies: LogicalFallacy[];
  sources: Source[];
}

export const inputTypeAtom = atom<InputType>('link');
export const inputUrlAtom = atom<string>('');
export const inputTextAtom = atom<string>('');
export const inputImageAtom = atom<File | null>(null);
export const inputImagePreviewAtom = atom<string | null>(null);

export const analysisResultAtom = atom<AnalysisResult | null>(null);
export const currentViewAtom = atom<'input' | 'result'>('input');