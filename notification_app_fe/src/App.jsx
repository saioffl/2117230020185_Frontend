import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://20.207.122.201/evaluation-service/notifications'
const VIEWED_STORAGE_KEY = 'priority-inbox:viewed-notifications'
const VIEW_OPTIONS = ['all', 'priority']
const TYPE_OPTIONS = ['all', 'placement', 'result', 'event', 'other']

const fallbackNotifications = [
  {
    id: 'd146095a-0d86-4a34-9e69-3900a14576bc',
    type: 'result',
    message: 'mid-sem',
    timestamp: '2026-04-22T17:51:30',
  },
  {
    id: 'b283218f-ea5a-4b7c-93a9-1f2f240d64b0',
    type: 'placement',
    message: 'CSX Corporation hiring',
    timestamp: '2026-04-22T17:51:18',
  },
  {
    id: '81589ada-0ad3-4f77-9554-f52fb558e09d',
    type: 'event',
    message: 'farewell',
    timestamp: '2026-04-22T17:51:06',
  },
  {
    id: '0005513a-142b-4bbc-8678-eefec65e1ede',
    type: 'result',
    message: 'mid-sem',
    timestamp: '2026-04-22T17:50:54',
  },
  {
    id: 'b971bd20-a629-4425-8f58-36cf1c3f9643',
    type: 'placement',
    message: 'placement update',
    timestamp: '2026-04-22T17:50:42',
  },
  {
    id: '3df2f3ff-3f72-4f79-b5cd-37ec9f61f2c1',
    type: 'event',
    message: 'campus notice',
    timestamp: '2026-04-22T17:50:30',
  },
]

const typeWeight = {
  placement: 100,
  result: 92,
  event: 72,
  other: 48,
}

const typeTone = {
  placement: 'high',
  result: 'high',
  event: 'medium',
  other: 'low',
}

const typeLabel = {
  placement: 'Placement',
  result: 'Result',
  event: 'Event',
  other: 'Other',
}

function normalizeNotification(item) {
  const id = String(item?.ID ?? item?.id ?? '')
  const type = String(item?.Type ?? item?.type ?? 'other').toLowerCase()
  const message = String(item?.Message ?? item?.message ?? '').trim()
  const timestamp = String(item?.Timestamp ?? item?.timestamp ?? '').trim()

  if (!id || !message || !timestamp) {
    return null
  }

  return {
    id,
    type: Object.prototype.hasOwnProperty.call(typeWeight, type) ? type : 'other',
    message,
    timestamp,
  }
}

function normalizeNotifications(data) {
  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data?.notifications)
      ? data.notifications
      : []

  return rawList.map(normalizeNotification).filter(Boolean)
}

function loadViewedIds() {
  if (typeof window === 'undefined') {
    return new Set()
  }

  try {
    const raw = window.localStorage.getItem(VIEWED_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []

    return new Set(parsed)
  } catch {
    return new Set()
  }
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function formatRelativeTime(timestamp) {
  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - new Date(timestamp).getTime()) / 60000),
  )

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const hours = Math.round(diffMinutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  return `${Math.round(hours / 24)}d ago`
}

function getScore(item, isViewed) {
  const ageMinutes = Math.max(
    1,
    (Date.now() - new Date(item.timestamp).getTime()) / 60000,
  )
  const freshnessBoost = Math.max(0, 26 - ageMinutes / 60) * 2
  const unreadBoost = isViewed ? 0 : 24
  const typeScore = typeWeight[item.type] ?? 42

  return Math.round(typeScore + freshnessBoost + unreadBoost)
}

function App() {
  const [notifications, setNotifications] = useState(fallbackNotifications)
  const [viewedIds, setViewedIds] = useState(loadViewedIds)
  const [activeView, setActiveView] = useState('priority')
  const [typeFilter, setTypeFilter] = useState('all')
  const [topN, setTopN] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadNotifications() {
      try {
        setLoading(true)
        setError('')

        const token = import.meta.env.VITE_ACCESS_TOKEN || ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const response = await fetch(API_URL, {
          signal: controller.signal,
          headers,
        })

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }

        const data = await response.json()
        const nextNotifications = normalizeNotifications(data)

        if (nextNotifications.length > 0) {
          setNotifications(nextNotifications)
        }
      } catch (requestError) {
        if (requestError?.name !== 'AbortError') {
          setError('Showing sample data because the notification API is unavailable.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      VIEWED_STORAGE_KEY,
      JSON.stringify(Array.from(viewedIds)),
    )
  }, [viewedIds])

  const visibleNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        const viewed = viewedIds.has(item.id)

        if (typeFilter !== 'all' && item.type !== typeFilter) {
          return false
        }

        if (activeView === 'priority' && viewed) {
          return false
        }

        return true
      })
      .sort((left, right) => {
        const leftViewed = viewedIds.has(left.id)
        const rightViewed = viewedIds.has(right.id)
        const scoreGap = getScore(right, rightViewed) - getScore(left, leftViewed)

        if (scoreGap !== 0) {
          return scoreGap
        }

        return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
      })
  }, [activeView, notifications, typeFilter, viewedIds])

  const priorityNotifications = visibleNotifications.slice(0, topN)
  const currentList = activeView === 'priority' ? priorityNotifications : visibleNotifications
  const totalNew = notifications.filter((item) => !viewedIds.has(item.id)).length
  const totalViewed = notifications.length - totalNew

  function markViewed(id) {
    setViewedIds((current) => {
      const next = new Set(current)

      next.add(id)

      return next
    })
  }

  function markAllViewed() {
    setViewedIds(new Set(notifications.map((item) => item.id)))
  }

  function resetInbox() {
    setViewedIds(new Set())
  }

  return (
    <main className="inbox-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Notifications</p>
          <h1>Clean inbox view</h1>
        </div>

        <div className="topbar-meta">
          <span>{totalNew} new</span>
          <span>{totalViewed} viewed</span>
        </div>
      </header>

      <section className="toolbar">
        <div className="segmented-control" role="tablist" aria-label="Inbox views">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={activeView === option ? 'active' : ''}
              onClick={() => setActiveView(option)}
            >
              {option === 'all' ? 'All notifications' : 'Priority'}
            </button>
          ))}
        </div>

        <div className="toolbar-actions">
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All types' : typeLabel[option]}
              </option>
            ))}
          </select>

          <label className="topn-control">
            Top
            <input
              type="number"
              min="1"
              max="10"
              value={topN}
              onChange={(event) => setTopN(Number(event.target.value) || 1)}
            />
          </label>

          <button type="button" className="ghost-button" onClick={markAllViewed}>
            Mark all viewed
          </button>

          <button type="button" className="ghost-button" onClick={resetInbox}>
            Reset
          </button>
        </div>
      </section>

      {loading ? <div className="notice">Loading notifications...</div> : null}
      {error ? <div className="notice notice-warning">{error}</div> : null}

      <section className="content-grid">
        <article className="list-panel">
          <div className="panel-head">
            <h2>{activeView === 'priority' ? 'Priority notifications' : 'All notifications'}</h2>
            <p>
              {activeView === 'priority'
                ? `Showing the top ${Math.min(topN, visibleNotifications.length)} unread items.`
                : 'Showing the full inbox with viewed and unread states.'}
            </p>
          </div>

          <div className="notification-list">
            {currentList.length === 0 ? (
              <div className="empty-state">No notifications found.</div>
            ) : (
              currentList.map((item) => {
                const viewed = viewedIds.has(item.id)
                const score = getScore(item, viewed)

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`notification-row ${viewed ? 'viewed' : 'new'}`}
                    onClick={() => markViewed(item.id)}
                  >
                    <div className="row-main">
                      <div>
                        <div className="row-title">{item.message}</div>
                        <div className="row-subtitle">
                          {typeLabel[item.type] ?? item.type} · {formatRelativeTime(item.timestamp)}
                        </div>
                      </div>

                      <div className="row-badges">
                        <span className={`type-pill ${typeTone[item.type] ?? 'low'}`}>
                          {viewed ? 'Viewed' : 'New'}
                        </span>
                        <span className="score">{score}</span>
                      </div>
                    </div>

                    <div className="row-footer">
                      <span>{item.id}</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </article>

        <aside className="list-panel summary-panel">
          <div className="panel-head">
            <h2>Priority rules</h2>
            <p>Unread and recent notifications are ranked higher.</p>
          </div>

          <ul className="rules-list">
            <li>Placement items rank highest.</li>
            <li>Results come next, then events.</li>
            <li>Viewed items stay visible in the inbox but are styled lightly.</li>
          </ul>
        </aside>
      </section>
    </main>
  )
}

export default App
