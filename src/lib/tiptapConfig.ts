import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'

// Load common languages for syntax highlighting
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

export const extensions = [
  StarterKit.configure({
    // Only allow H1-H3 headings
    heading: {
      levels: [1, 2, 3],
    },
    // Disable default code block to use lowlight version
    codeBlock: false,
    // Keep these useful extensions
    // bulletList: true,
    // orderedList: true,
    // blockquote: true,
    // bold: true,
    // italic: true,
    // code: true, // inline code
    // link: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class: 'rounded-md bg-muted/50 p-4 font-mono text-sm border',
    },
    defaultLanguage: 'plaintext',
  }),
]
