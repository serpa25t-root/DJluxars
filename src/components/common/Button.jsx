import React from 'react'

/**
 * Botón reutilizable LuxArts — Cinematic Crimson
 * @param {'primary' | 'secondary' | 'text'} variant
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
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none text-sm px-6 py-2.5 will-change-transform active:scale-[0.97]'

  const variants = {
    primary:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 hover:shadow-xl border border-red-600/30 font-semibold',
    secondary:
      'bg-transparent border border-zinc-800 text-zinc-100 hover:bg-zinc-900 hover:border-red-600/30 hover:text-white focus-visible:ring-zinc-700',
    text: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50 focus-visible:ring-zinc-700 px-3 py-2',
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
