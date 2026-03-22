import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Undo, Redo, Highlighter,
  Minus, Type, ImagePlus, Square, RectangleHorizontal
} from 'lucide-react';

// Custom resizable image extension with alignment
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '50%',
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: attributes => ({
          height: attributes.height,
        }),
      },
      float: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.float) return {};
          return {
            style: `float: ${attributes.float}; margin: ${attributes.float === 'left' ? '0 1rem 1rem 0' : '0 0 1rem 1rem'};`,
          };
        },
      },
      display: {
        default: null,
        renderHTML: attributes => {
          if (attributes.float) return {};
          if (attributes.display === 'center') {
            return {
              style: 'display: block; margin: 1rem auto;',
            };
          }
          return {};
        },
      },
    };
  },
});

const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all ${
      isActive
        ? 'bg-emerald-100 text-emerald-700'
        : 'text-gray-600 hover:bg-gray-100'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

const RichTextEditor = ({ content, onChange, onBlur, placeholder = "Write your content here..." }) => {
  const fileInputRef = useRef(null);
  const imageMenuRef = useRef(null);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [imageAlignment, setImageAlignment] = useState('left');

  // Close image menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(event.target)) {
        setShowImageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full cursor-pointer',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      if (onBlur) onBlur();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Handle image upload with alignment prompt
  const handleImageUpload = useCallback((event, alignment = 'left') => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          const attrs = { src: result, width: '40%' };
          if (alignment === 'left') {
            attrs.float = 'left';
          } else if (alignment === 'right') {
            attrs.float = 'right';
          } else if (alignment === 'center') {
            attrs.display = 'center';
            attrs.width = '80%';
          }
          editor.chain().focus().setImage(attrs).run();
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor]);

  // Handle image URL with alignment
  const addImageFromUrl = useCallback((alignment = 'left') => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      const attrs = { src: url, width: '40%' };
      if (alignment === 'left') {
        attrs.float = 'left';
      } else if (alignment === 'right') {
        attrs.float = 'right';
      } else if (alignment === 'center') {
        attrs.display = 'center';
        attrs.width = '80%';
      }
      editor.chain().focus().setImage(attrs).run();
    }
  }, [editor]);

  // Insert image with selected alignment
  const insertImage = useCallback((alignment) => {
    setImageAlignment(alignment);
    setShowImageMenu(false);
    fileInputRef.current?.click();
  }, []);

  // Handle link
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap items-center gap-0.5">
        {/* Text Style */}
        <div className="flex items-center">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph') && !editor.isActive('heading')}
            title="Paragraph"
          >
            <Type size={18} />
          </MenuButton>
        </div>

        <Divider />

        {/* Basic Formatting */}
        <div className="flex items-center">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter size={18} />
          </MenuButton>
        </div>

        <Divider />

        {/* Alignment */}
        <div className="flex items-center">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify size={18} />
          </MenuButton>
        </div>

        <Divider />

        {/* Lists & Quote */}
        <div className="flex items-center">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code size={18} />
          </MenuButton>
        </div>

        <Divider />

        {/* Link & Image */}
        <div className="flex items-center relative">
          <MenuButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon size={18} />
          </MenuButton>

          {/* Image dropdown */}
          <div className="relative" ref={imageMenuRef}>
            <MenuButton
              onClick={() => setShowImageMenu(!showImageMenu)}
              title="Insert Image"
            >
              <ImageIcon size={18} />
            </MenuButton>

            {showImageMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Image Position</div>
                <button
                  type="button"
                  onClick={() => insertImage('left')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <AlignLeft size={16} />
                  Float Left (text wraps right)
                </button>
                <button
                  type="button"
                  onClick={() => insertImage('right')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <AlignRight size={16} />
                  Float Right (text wraps left)
                </button>
                <button
                  type="button"
                  onClick={() => insertImage('center')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <AlignCenter size={16} />
                  Center (full width)
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, imageAlignment)}
            className="hidden"
          />
        </div>

        <Divider />

        {/* Horizontal Rule */}
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus size={18} />
        </MenuButton>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <div className="flex items-center">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={18} />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Hidden file input for URL images */}
      <style>{`
        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #10b981;
        }
        .ProseMirror p::after {
          content: "";
          display: table;
          clear: both;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.875rem 0 0.5rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
          font-style: italic;
        }
        .ProseMirror code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
        }
        .ProseMirror pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1.5rem 0;
        }
        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0.1rem 0.2rem;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
