import React from 'react'

interface Props {
  link: string
  children: React.ReactNode
  className?: string
}

const LinkWrapper = ({ link, children, className }: Props) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </a>
  )
}

export default LinkWrapper
