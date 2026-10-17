import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Redo2, Underline, Undo2 } from 'lucide-react';
import { marked } from 'marked';

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const hasHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const toolbarButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded text-ink-soft hover:bg-brand-light hover:text-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30';

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ id, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nextValue = value && !hasHtml(value) ? String(marked.parse(value)) : value;
    if (editor.innerHTML !== nextValue) editor.innerHTML = nextValue;
  }, [value]);

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editorRef.current?.contains(selection.anchorNode)) return;
    selectionRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const emitChange = () => onChange(editorRef.current?.innerHTML ?? '');

  const run = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    rememberSelection();
    emitChange();
  };

  return (
    <div className="overflow-hidden rounded-md border border-surface-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <div className="flex flex-wrap items-center gap-1 border-b border-surface-border bg-surface-page px-2 py-2" role="toolbar" aria-label="Article formatting">
        <select
          aria-label="Text style"
          className="h-9 rounded border border-surface-border bg-white px-2 text-[13px] text-ink"
          defaultValue="p"
          onMouseDown={rememberSelection}
          onChange={(event) => run('formatBlock', event.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
        </select>
        <select
          aria-label="Font family"
          className="h-9 max-w-40 rounded border border-surface-border bg-white px-2 text-[13px] text-ink"
          defaultValue="IBM Plex Sans"
          onMouseDown={rememberSelection}
          onChange={(event) => run('fontName', event.target.value)}
        >
          <option value="IBM Plex Sans">IBM Plex Sans</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <select
          aria-label="Font size"
          className="h-9 rounded border border-surface-border bg-white px-2 text-[13px] text-ink"
          defaultValue="3"
          onMouseDown={rememberSelection}
          onChange={(event) => run('fontSize', event.target.value)}
        >
          <option value="1">10 px</option>
          <option value="2">13 px</option>
          <option value="3">16 px</option>
          <option value="4">18 px</option>
          <option value="5">24 px</option>
          <option value="6">32 px</option>
          <option value="7">48 px</option>
        </select>
        <span className="mx-1 h-6 w-px bg-surface-border" aria-hidden="true" />
        {[
          { command: 'bold', label: 'Bold', Icon: Bold },
          { command: 'italic', label: 'Italic', Icon: Italic },
          { command: 'underline', label: 'Underline', Icon: Underline },
          { command: 'insertUnorderedList', label: 'Bulleted list', Icon: List },
          { command: 'insertOrderedList', label: 'Numbered list', Icon: ListOrdered },
          { command: 'undo', label: 'Undo', Icon: Undo2 },
          { command: 'redo', label: 'Redo', Icon: Redo2 },
        ].map(({ command, label, Icon }) => (
          <button
            key={command}
            type="button"
            className={toolbarButtonClass}
            aria-label={label}
            title={label}
            onMouseDown={(event) => {
              event.preventDefault();
              run(command);
            }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        id={id}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[260px] px-5 py-4 text-[15px] leading-relaxed text-ink outline-none empty:before:pointer-events-none empty:before:text-ink-muted empty:before:content-[attr(data-placeholder)] [&_blockquote]:border-l-4 [&_blockquote]:border-brand/30 [&_blockquote]:pl-4 [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        data-placeholder="Start writing the article…"
        onInput={emitChange}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={rememberSelection}
      />
      <p className="border-t border-surface-border bg-surface-page px-3 py-2 text-[11px] text-ink-muted">
        Select text to change its font, size or style.
      </p>
    </div>
  );
};
