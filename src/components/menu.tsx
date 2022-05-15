import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { IoMdTrash } from 'react-icons/io'
import { MdClose, MdEdit } from 'react-icons/md'

interface MenuProps {
  open?: boolean
  hideEdit?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onClose?: () => void
}

const Menu = ({ open, hideEdit = false, onEdit, onDelete, onClose }: MenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(open || false)

  return (
    <div>
      {isOpen ? (
        <div className="flex items-center gap-x-2">
          {!hideEdit && (
            <button className="text-primary" onClick={() => onEdit && onEdit()}>
              <MdEdit className="text-xl" />
            </button>
          )}
          <button className="text-red-500 text-xl" onClick={() => onDelete && onDelete()}>
            <IoMdTrash />
          </button>
          <button
            onClick={() => {
              setIsOpen(false)
              onClose && onClose()
            }}
          >
            <MdClose className="text-xl" />
          </button>
        </div>
      ) : (
        <BsThreeDots className="text-2xl cursor-pointer" onClick={() => setIsOpen(true)} />
      )}
    </div>
  )
}

export default Menu
