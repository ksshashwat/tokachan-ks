import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { FloatingControls } from './components/FloatingControls'
import { Paper } from './components/Paper'
import { PaperDock } from './components/PaperDock'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { notesService, type Colors } from '@/lib/supabaseService'

export function HomePage() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)
  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)



  // Load notes on component mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesData = await notesService.getAllUserNotes()
        setNotes(notesData)
      } catch (error) {
        console.error('Failed to load notes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  const handlePaperSelect = (id: string) => {
    setActiveNoteId(id)
  }

  const handleClosePaper = () => {
    setActiveNoteId(null)
  }

  const handleColorChange = async (color: Colors) => {
    if (activeNoteId) {
      try {
        await notesService.updateNote(activeNoteId, { color })
        // Update local state optimistically
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === activeNoteId ? { ...note, color } : note
          )
        )
      } catch (error) {
        console.error('Failed to update note color:', error)
      }
    }
  }

  const handleDeleteClick = () => {
    if (!activeNoteId) return
    setNoteToDelete(activeNoteId) // Capture the note ID before opening modal
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return
    
    setShowDeleteConfirm(false)
    
    try {
      // Call delete API immediately
      await notesService.deleteNote(noteToDelete)
      
      // Remove from local state
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete))
      
      // Close the paper view
      setActiveNoteId(null)
      setNoteToDelete(null)
      
      console.log('✅ Note deleted successfully on first confirm')
    } catch (error) {
      console.error('❌ Failed to delete note:', error)
      // Reset state on error
      setNoteToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setNoteToDelete(null) // Clear the note to delete
  }

  // Animation completion handler (now simplified for trash can animation only)
  const handleDeleteAnimationComplete = async () => {
    if (!deletingNoteId) return
    
    // Open trash can lid
    setIsTrashOpen(true)
    
    // Wait a bit, then close lid
    setTimeout(() => {
      setIsTrashOpen(false)
      setDeletingNoteId(null)
    }, 400)
  }

  // Click outside handler
  useEffect(() => {
    if (!activeNoteId) return
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        paperRef.current &&
        !paperRef.current.contains(target) &&
        floatingRef.current &&
        !floatingRef.current.contains(target)
      ) {
        handleClosePaper()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeNoteId])

  // Refs for click-outside logic
  const paperRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  const activeNote = notes?.find((note) => note.id === activeNoteId)

  if (loading) {
    return (
      <div className="bg-gradient-bg font-rubik flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-bg font-rubik flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <motion.div
        key="welcome"
        className="max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="bg-gradient-playful mb-2 bg-clip-text text-6xl font-bold text-transparent"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            bounce: 0.3,
          }}
        >
          Tokachan
        </motion.h1>
        <motion.p
          className="text-muted-foreground mb-5 text-xl"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.2 }}
        >
          Your thoughts, beautifully organized on digital paper.
        </motion.p>
        <motion.div
          className="text-muted-foreground flex items-center justify-center gap-4 text-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', bounce: 0.2 }}
        >
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span>Select or create a paper from the dock below to start writing</span>
          <div className="bg-accent h-2 w-2 animate-pulse rounded-full" />
        </motion.div>
      </motion.div>

      {activeNoteId && activeNote && <div className="bg-background/50 absolute inset-0" />}

      <AnimatePresence>
        {activeNoteId && activeNote && (
          <Paper 
            key={activeNoteId} 
            note={activeNote} 
            paperRef={paperRef}
            isDeleting={false} // No longer using animation for deletion
            onDeleteAnimationComplete={handleDeleteAnimationComplete}
          />
        )}
      </AnimatePresence>

      {/* Paper dock */}
      <PaperDock 
        notes={notes ?? []} 
        activeNoteId={activeNoteId} 
        onNoteSelect={handlePaperSelect}
        onNoteCreated={(newNote) => {
          setNotes(prevNotes => [newNote, ...prevNotes])
          setActiveNoteId(newNote.id)
        }}
      />

      {/* Floating controls when paper is active */}
      <AnimatePresence>
        {activeNoteId && (
          <FloatingControls
            onClose={handleClosePaper}
            floatingRef={floatingRef}
            onColorChange={handleColorChange}
            onDelete={handleDeleteClick}
            isTrashOpen={isTrashOpen}
          />
                  )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
        />


      </div>
    )
  }
