import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Digite seu conteúdo...",
  className,
  readOnly = false 
}: RichTextEditorProps) => {
  const modules = useMemo(() => ({
    toolbar: readOnly ? false : {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), [readOnly]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align'
  ];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="rich-text-editor">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          style={{
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
          }}
        />
      </div>

      <style>{`
        .rich-text-editor .ql-toolbar {
          border-color: hsl(var(--border));
          background: hsl(var(--muted));
        }
        
        .rich-text-editor .ql-container {
          border-color: hsl(var(--border));
          background: hsl(var(--card));
          color: hsl(var(--card-foreground));
          font-family: inherit;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 150px;
          color: hsl(var(--card-foreground));
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: hsl(var(--muted-foreground));
        }
        
        .rich-text-editor .ql-snow .ql-fill {
          fill: hsl(var(--muted-foreground));
        }
        
        .rich-text-editor .ql-snow .ql-picker {
          color: hsl(var(--muted-foreground));
        }
        
        .rich-text-editor .ql-snow.ql-toolbar button:hover,
        .rich-text-editor .ql-snow .ql-toolbar button:hover,
        .rich-text-editor .ql-snow.ql-toolbar button:focus,
        .rich-text-editor .ql-snow .ql-toolbar button:focus,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active,
        .rich-text-editor .ql-snow .ql-toolbar button.ql-active {
          color: hsl(var(--accent));
        }
        
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-snow.ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-snow .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--accent));
        }
        
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-snow.ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-snow .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--accent));
        }
      `}</style>
    </Card>
  );
};