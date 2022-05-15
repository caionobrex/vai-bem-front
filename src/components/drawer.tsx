import { useEffect, useRef } from 'react'
import { MdClose } from 'react-icons/md'

interface DrawerProps {
  isOpen?: boolean
  position?: 'left' | 'right'
  className?: string
  children?: React.ReactNode
  onClose?: () => void
}

export default function Drawer({
  isOpen = false,
  position = 'right',
  className,
  children,
  onClose,
}: DrawerProps): JSX.Element {
  useEffect(() => {
    document.body.style.overflowY = isOpen ? 'hidden' : 'auto'
  }, [isOpen])

  return (
    <div
      style={{ zIndex: 1000 }}
      className={`fixed top-0 h-full bg-white transition-all duration-500 transform shadow overflow-x-auto ${
        position == 'left' ? 'left-0' : 'right-0'
      } ${
        isOpen
          ? 'translate-x-0'
          : !isOpen && position === 'left'
          ? '-translate-x-full'
          : 'translate-x-full'
      } ${className}`}
    >
      <MdClose
        className="absolute top-2 right-2 text-2xl cursor-pointer"
        onClick={() => onClose && onClose()}
      />
      {children}
    </div>
  )
}
