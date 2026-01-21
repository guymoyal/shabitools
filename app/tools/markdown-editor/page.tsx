import { Metadata } from 'next';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import Overview from '@/components/MarkdownEditor/Overview/Overview';
import overviewData from '@/data/tools/markdown-editor/overview.json';

export const metadata: Metadata = {
  title: 'Markdown Editor - Live Preview Markdown Online | iziTools',
  description: overviewData.description,
  keywords: 'markdown editor, markdown preview, live markdown, markdown online, markdown editor online',
  alternates: {
    canonical: 'https://izitools.com/tools/markdown-editor',
  },
};

export default function MarkdownEditorPage() {
  return (
    <>
      <MarkdownEditor />
      <Overview />
    </>
  );
}
