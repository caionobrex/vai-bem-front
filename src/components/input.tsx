import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

const Input = (props: any) => {
  const [focus, setFocus] = useState<boolean>(false)

  return (
    <div className="flex flex-col">
      <motion.label
        htmlFor={props.label}
        className="flex items-center gap-x-3 px-4" animate={focus ? 'active' : ''}
        variants={{active: { translateY: -10 }}}
      >
        {props.icon && props.icon}
        <motion.span
          animate={focus ? 'active' : ''}
          variants={{active: { color: '#691DBC', scale: 0.8 }}}
        >
          {props.label}
        </motion.span>
      </motion.label>

      <input
        {...props.register}
        type={props.type || 'text'}
        id={props.label}
        className="px-6 border-b w-full outline-none transition-all duration-500 focus:border-b-primary"
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          props.register?.onBlur(e)
          setFocus(false)
        }}
      />

      <div className="mt-1">
        {props.error?.message ? (
          <span className="flex items-center gap-x-2 text-red-500 text-sm">
            <FiAlertCircle />
            <span>{props.error?.message}</span>
          </span>
        ) : (
          <div className="h-5"></div>
        )}
      </div>
    </div>
  )
}

export default Input