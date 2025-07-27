import { motion } from 'motion/react'

interface FlyingPaperBallProps {
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  onAnimationComplete: () => void
  color: string
}

export const FlyingPaperBall = ({ 
  startPosition, 
  endPosition, 
  onAnimationComplete,
  color 
}: FlyingPaperBallProps) => {
  // Calculate control points for cubic bezier curve
  const controlPoint1 = {
    x: startPosition.x + (endPosition.x - startPosition.x) * 0.3,
    y: startPosition.y - 200, // Arc upward
  }
  const controlPoint2 = {
    x: endPosition.x - 100,
    y: endPosition.y - 100,
  }

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        left: startPosition.x,
        top: startPosition.y,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 0.1,
        rotate: 0,
      }}
      animate={{
        x: endPosition.x - startPosition.x,
        y: endPosition.y - startPosition.y,
        scale: [0.1, 0.8, 0.6, 0.3, 0.1],
        rotate: [0, 180, 360, 540, 720],
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.2, 0.5, 0.8, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
        // Custom path animation would go here if we had more control
      }}
      onAnimationComplete={onAnimationComplete}
    />
  )
} 