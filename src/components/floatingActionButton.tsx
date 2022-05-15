interface FloatingActionButtonProps {
  children: React.ReactNode
  onClick: () => void
}

export default function FloatingActionButton({
  children, onClick
}: FloatingActionButtonProps): JSX.Element {
  return (
    <button
      className="bg-primary fixed right-8 bottom-8 flex justify-center items-center w-16 h-16 rounded-full shadow-lg"
      onClick={onClick}
    >
      {children}
    </button>
  )
}