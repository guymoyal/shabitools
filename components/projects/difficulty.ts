import type { Project } from '@/types/project';

export const DIFFICULTY_STYLES: Record<Project['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-red-100 text-red-800',
};
