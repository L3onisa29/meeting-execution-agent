import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="Dashboard">
          <span className="brand-mark">ME</span>
          <span>
            <strong>Meeting Execution</strong>
            <small>Agent workspace</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link to="/dashboard" activeProps={{ className: 'active' }}>
            Dashboard
          </Link>
          <Link to="/meetings" activeProps={{ className: 'active' }}>
            Meetings
          </Link>
          <Link to="/settings" activeProps={{ className: 'active' }}>
            Settings
          </Link>
        </nav>
      </aside>
      <div className="content">{children}</div>
    </div>
  )
}

