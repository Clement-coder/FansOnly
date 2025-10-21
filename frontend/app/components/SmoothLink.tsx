'use client'

import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { FC, PropsWithChildren } from 'react'

const SmoothLink: FC<PropsWithChildren<LinkProps & { className?: string }>> = ({ children, ...props }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const href = e.currentTarget.href
    const targetId = href.replace(/.*#/, '')
    const elem = document.getElementById(targetId)
    elem?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Link {...props} onClick={handleScroll}>
      {children}
    </Link>
  )
}

export default SmoothLink
