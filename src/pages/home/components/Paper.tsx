import debounce from 'lodash.debounce'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import '../editor.styles.css'

import { PaperEditor } from './PaperEditor'
import { notesService, type Note } from '@/lib/supabaseService'
import { ErrorBoundary } from '@/components/ErrorBoundary'

import { COLORS_MAP } from '@/lib/constants'

type PaperProps = {
  note: Note
  paperRef: React.Ref<HTMLDivElement>
  isDeleting?: boolean
  onDeleteAnimationComplete?: () => void
}

const DEBOUNCE_TIME = 1000

export const Paper = ({ note, paperRef, isDeleting = false, onDeleteAnimationComplete }: PaperProps) => {
  const paperLayoutId = `paper-${note.id}`
  const [localTitle, setLocalTitle] = useState(note.title)

  const hasUnsavedChanges = useRef(false)

  const debouncedSave = useMemo(
    () =>
      debounce(async (noteId: string, data: { title?: string }) => {
        try {
          await notesService.updateNote(noteId, data)
          hasUnsavedChanges.current = false
        } catch (error) {
          console.error('Failed to save note:', error)
        }
      }, DEBOUNCE_TIME),
    []
  )

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setLocalTitle(newTitle) // Immediate UI update
    hasUnsavedChanges.current = true
    debouncedSave(note.id, { title: newTitle }) // Background save
  }

  // Sync local state when note prop changes (from server updates)
  useEffect(() => {
    setLocalTitle(note.title)
  }, [note.title])

  // Flush any pending saves when component unmounts
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges.current) {
        void debouncedSave.flush()
      }
    }
  }, [debouncedSave])

  return (
    <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        ref={paperRef}
        layoutId={paperLayoutId}
        className="bg-gradient-paper shadow-paper border-paper-border rounded-lg border p-8 pl-9"
        style={{
          // A4 proportions scaled down to fit screen
          width: '420px',
          height: '594px',
          aspectRatio: '210/297',
        }}
        initial={{ scale: 0.2, y: 300 }}
        animate={
          isDeleting 
            ? { opacity: 0, scale: 0.8 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        exit={{ scale: 0.2, y: 300, transition: { duration: 0.1 } }}
        transition={{
          duration: isDeleting ? 0.3 : 0.6,
          ease: 'easeInOut',
        }}
        onAnimationComplete={() => {
          if (isDeleting && onDeleteAnimationComplete) {
            onDeleteAnimationComplete()
          }
        }}
      >
        {/* Paper punch holes */}
        <div className="absolute top-0 bottom-0 left-3 flex flex-col justify-evenly">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background border-muted h-4 w-4 rounded-full border-2" />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">
          <div className="mb-2">
            <motion.div
              className="mb-2 h-6 w-6 rounded-full"
              style={{ backgroundColor: COLORS_MAP[note.color] }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.input
              className="text-foreground text-2xl font-semibold focus:outline-none"
              initial={{ scale: 0.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              value={localTitle}
              onChange={handleTitleChange}
            />
          </div>

          <ErrorBoundary>
            <PaperEditor note={note} />
          </ErrorBoundary>
        </div>
      </motion.div>
    </div>
  )
}
