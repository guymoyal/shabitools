import { describe, expect, it } from 'vitest';
import { howToJsonLd } from '../schema';
import type { Project } from '@/types/project';

const project: Project = {
  slug: 'build-test-shelf',
  title: 'How to Build a Simple Test Shelf',
  description: 'A minimal project fixture for unit tests — 150 characters of description text to satisfy the meta description length requirement for testing.',
  category: 'woodworking',
  difficulty: 'beginner',
  timeRequired: '2–3 hours',
  timeRequiredIso: 'PT3H',
  estCost: '$20–$40',
  toolsNeeded: [
    { name: 'Drill', reviewSlug: 'makita-xfd131' },
    { name: 'Level' },
    { name: 'Stud finder' },
  ],
  materials: ['1x10 board', '2-inch screws', 'Wall anchors'],
  steps: [
    { name: 'Measure and mark', text: 'Locate studs with a stud finder and mark mounting positions with a pencil.' },
    { name: 'Cut the board', text: 'Cut your 1x10 board to the desired length using a circular saw or hand saw.' },
    { name: 'Drill pilot holes', text: 'Drill pilot holes through the shelf board at stud locations to prevent splitting.' },
    { name: 'Mount brackets', text: 'Attach shelf brackets to the wall studs using 2-inch screws driven through the pilot holes.' },
    { name: 'Set the shelf', text: 'Lay the board across the brackets and check for level before securing with screws from below.' },
  ],
  faq: [
    { q: 'Do I need studs?', a: 'For heavy items, yes — studs are essential for a strong mount.' },
    { q: 'What drill bit size?', a: 'Use a 1/8-inch bit for pilot holes in standard 3/4-inch shelf boards.' },
    { q: 'Can I use drywall anchors?', a: 'Use anchors only for light loads under 20 lbs; hit studs for anything heavier.' },
    { q: 'How far apart should brackets be?', a: 'Space brackets no more than 24 inches apart to prevent sagging on a standard 3/4-inch shelf.' },
  ],
  body: 'A placeholder body for testing purposes.',
  related: [],
  datePublished: '2026-06-12',
  dateModified: '2026-06-12',
};

describe('howToJsonLd', () => {
  const siteUrl = 'https://shabitools.com';
  const ld = howToJsonLd(project, siteUrl);

  it('sets @context and @type', () => {
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('HowTo');
  });

  it('sets name equal to title', () => {
    expect(ld.name).toBe(project.title);
  });

  it('sets description', () => {
    expect(ld.description).toBe(project.description);
  });

  it('sets totalTime to timeRequiredIso', () => {
    expect(ld.totalTime).toBe(project.timeRequiredIso);
  });

  it('sets estimatedCost as MonetaryAmount', () => {
    expect(ld.estimatedCost).toEqual({
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: project.estCost,
    });
  });

  it('maps toolsNeeded to HowToTool[]', () => {
    expect(ld.tool).toEqual([
      { '@type': 'HowToTool', name: 'Drill' },
      { '@type': 'HowToTool', name: 'Level' },
      { '@type': 'HowToTool', name: 'Stud finder' },
    ]);
  });

  it('maps materials to HowToSupply[]', () => {
    expect(ld.supply).toEqual([
      { '@type': 'HowToSupply', name: '1x10 board' },
      { '@type': 'HowToSupply', name: '2-inch screws' },
      { '@type': 'HowToSupply', name: 'Wall anchors' },
    ]);
  });

  it('maps steps to HowToStep[] with position, name, text, and url', () => {
    expect(ld.step).toHaveLength(5);
    expect(ld.step[0]).toEqual({
      '@type': 'HowToStep',
      position: 1,
      name: 'Measure and mark',
      text: 'Locate studs with a stud finder and mark mounting positions with a pencil.',
      url: `${siteUrl}/projects/build-test-shelf#step-1`,
    });
    expect(ld.step[4]).toMatchObject({
      position: 5,
      url: `${siteUrl}/projects/build-test-shelf#step-5`,
    });
  });
});
