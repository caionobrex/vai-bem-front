import { useState } from 'react'

interface SwitchProps {
  defaultValue?: boolean
  onChange?: (isActive: boolean) => void
}

const Switch = ({ defaultValue, onChange }: SwitchProps): JSX.Element => {
  const [isActive, setIsActive] = useState(defaultValue || false)

  return (
    <button
      type="button"
      className="relative w-14 h-6 rounded-full transform bg-gray-300 transition-all duration-500 outline-none overflow-hidden"
      onClick={() => {
        setIsActive(!isActive)
        onChange && onChange(!isActive)
      }}
    >
      <div
        className={`absolute left-0 h-full top-1/2 transform -translate-y-1/2 bg-primary transition-all duration-500 rounded-full ${
          isActive ? 'w-full' : 'w-0'
        }`}
      ></div>
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full transition-all duration-500 w-5 h-5`}
        style={{ left: isActive ? '56%' : 6 }}
      ></div>
    </button>
  )
}

export default Switch
