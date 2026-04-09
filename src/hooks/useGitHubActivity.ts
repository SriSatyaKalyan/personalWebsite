import { useState, useEffect } from 'react'

export interface GitHubEvent {
  id: string
  type: string
  repo: string
  repoUrl: string
  description: string
  commitMessages: string[]
  url: string
  createdAt: string
}

const USERNAME = 'SriSatyaKalyan'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function describeEvent(event: any): { description: string; url: string } {
  const repo   = event.repo.name                     // "Owner/repo"
  const short  = repo.split('/')[1] ?? repo
  const repoUrl = `https://github.com/${repo}`

  switch (event.type) {
    case 'PushEvent': {
      const n = event.payload.commits?.length ?? 1
      return { description: `Pushed ${n} commit${n !== 1 ? 's' : ''} to ${short}`, url: repoUrl }
    }
    case 'CreateEvent': {
      const rt  = event.payload.ref_type
      const ref = event.payload.ref
      if (rt === 'repository') return { description: `Created repository ${short}`, url: repoUrl }
      return { description: `Created ${rt} "${ref}" in ${short}`, url: repoUrl }
    }
    case 'PullRequestEvent': {
      const pr     = event.payload.pull_request
      const merged = pr?.merged
      const verb   = event.payload.action === 'closed'
        ? (merged ? 'Merged' : 'Closed')
        : event.payload.action === 'opened' ? 'Opened' : 'Updated'
      return { description: `${verb} PR #${pr?.number} in ${short}`, url: pr?.html_url ?? repoUrl }
    }
    case 'IssuesEvent': {
      const issue = event.payload.issue
      const verb  = event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)
      return { description: `${verb} issue #${issue?.number} in ${short}`, url: issue?.html_url ?? repoUrl }
    }
    case 'IssueCommentEvent': {
      const issue = event.payload.issue
      return { description: `Commented on issue #${issue?.number} in ${short}`, url: event.payload.comment?.html_url ?? repoUrl }
    }
    case 'WatchEvent':
      return { description: `Starred ${short}`, url: repoUrl }
    case 'ForkEvent':
      return { description: `Forked ${short}`, url: event.payload.forkee?.html_url ?? repoUrl }
    case 'DeleteEvent':
      return { description: `Deleted ${event.payload.ref_type} in ${short}`, url: repoUrl }
    case 'ReleaseEvent': {
      const rel = event.payload.release
      return { description: `Released ${rel?.tag_name} in ${short}`, url: rel?.html_url ?? repoUrl }
    }
    case 'PublicEvent':
      return { description: `Made ${short} public`, url: repoUrl }
    default:
      return { description: `Activity in ${short}`, url: repoUrl }
  }
}

interface State {
  events: GitHubEvent[]
  loading: boolean
  error: string | null
}

async function fetchCommitMessage(
  repo: string,
  sha: string,
  headers: Record<string, string>
): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, { headers })
    if (!res.ok) return []
    const data = await res.json()
    const msg = data.commit?.message?.split('\n')[0]
    return msg ? [msg] : []
  } catch {
    return []
  }
}

export function useGitHubActivity(limit = 8) {
  const [state, setState] = useState<State>({ events: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    const token   = (import.meta as any).env?.VITE_GITHUB_TOKEN as string | undefined
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, { headers })
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
        return res.json()
      })
      .then(async (data: any[]) => {
        if (cancelled) return
        const slice = data.slice(0, limit)

        const events: GitHubEvent[] = await Promise.all(
          slice.map(async e => {
            const { description, url } = describeEvent(e)
            const commitMessages =
              e.type === 'PushEvent' && e.payload.head
                ? await fetchCommitMessage(e.repo.name, e.payload.head, headers)
                : []
            return {
              id:             e.id,
              type:           e.type,
              repo:           e.repo.name.split('/')[1] ?? e.repo.name,
              repoUrl:        `https://github.com/${e.repo.name}`,
              description,
              commitMessages,
              url,
              createdAt:      timeAgo(e.created_at),
            }
          })
        )

        if (!cancelled) setState({ events, loading: false, error: null })
      })
      .catch(err => {
        if (!cancelled) setState({ events: [], loading: false, error: err.message })
      })

    return () => { cancelled = true }
  }, [limit])

  return state
}
