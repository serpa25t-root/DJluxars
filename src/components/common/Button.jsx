import React from 'react'

/**
 * Botón reutilizable para LuxArts
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'text'} props.variant - Variante visual
 * @param {React.ReactNode} props.children
 * @param {string} props.className - Clases adicionales
 * @param {() => void} props.onClick
 * @param {string} props.type
 */
const Button = ({
  variant = 'primary',
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none text-sm px-6 py-2.5'

  const variants = {
    primary:
      'bg-[#c5a253] text-zinc-950 hover:bg-[#b8933f] focus-visible:ring-[#c5a253] shadow-lg shadow-[#c5a253]/20 font-semibold',
    secondary:
      'bg-transparent border border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:border-zinc-600 focus-visible:ring-zinc-600',
    text: 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800/50 focus-visible:ring-zinc-600 px-3 py-2',
  }

  const variantStyles = variants[variant] || variants.primary

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
