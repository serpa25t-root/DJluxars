import React from 'react'

/**
 * Input taste — cinematic dark, red focus, DRY
 * Evita repetición entre Login/Register
 */
const Input = ({ label, id, type = 'text', placeholder, value, onChange, required, autoComplete }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium tracking-wide text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all duration-200 will-change-transform"
      />
    </div>
  )
}

export default Input
