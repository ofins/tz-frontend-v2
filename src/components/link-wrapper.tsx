import React from 'react'

interface Props {
  link: string
  children: React.ReactNode
}

const LinkWrapper = ({ link, children }: Props) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </a>
  )
}

export default LinkWrapper
