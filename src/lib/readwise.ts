const TOKEN = import.meta.env.VITE_READWISE_TOKEN as string

export interface ReadwiseHighlight {
  id: number
  text: string
  title: string
  author: string
  cover_image_url: string | null
  source_url: string | null
  is_book: boolean
}

// Maps lowercase platform name / domain-like author to a canonical domain
const PLATFORM_DOMAINS: Record<string, string> = {
  'substack':      'substack.com',
  'reddit':        'reddit.com',
  'the atlantic':  'theatlantic.com',
  'atlantic':      'theatlantic.com',
  'medium':        'medium.com',
  'twitter':       'twitter.com',
  'x':             'x.com',
  'youtube':       'youtube.com',
  'hacker news':   'news.ycombinator.com',
  'hackernews':    'news.ycombinator.com',
}

function platformDomain(author: string): string | null {
  const lower = author.toLowerCase().trim()
  if (PLATFORM_DOMAINS[lower]) return PLATFORM_DOMAINS[lower]
  // Author is already a domain (e.g. "substack.com", "theatlantic.com")
  if (/^[\w.-]+\.[a-z]{2,}$/.test(lower)) return lower
  return null
}

async function resolveImage(h: {
  cover_image_url: string | null
  source_url: string | null
  title: string
  author: string
  is_book: boolean
}): Promise<string | null> {
  if (h.cover_image_url) return h.cover_image_url

  // Web article with URL → platform favicon/logo
  if (h.source_url) {
    try {
      const domain = new URL(h.source_url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      // fall through
    }
  }

  // No URL but author looks like a known platform → use its logo
  const domain = platformDomain(h.author)
  if (domain && !h.is_book) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  }

  // Book with no cover → try bookcover API
  if (h.is_book) {
    try {
      const params = new URLSearchParams({ book_title: h.title, author_name: h.author })
      const res = await fetch(`https://bookcover.longitood.com/bookcover?${params}`)
      if (res.ok) {
        const data = await res.json()
        return data.url ?? null
      }
    } catch {
      // ignore
    }
  }

  return null
}

export async function getDailyReview(): Promise<ReadwiseHighlight[]> {
  const res = await fetch('https://readwise.io/api/v2/review/', {
    headers: { Authorization: `Token ${TOKEN}` },
  })

  if (!res.ok) throw new Error(`Readwise daily review failed: ${res.status}`)
  const data = await res.json()

  const base = (data.highlights ?? []).map((h: any) => ({
    id:              h.id,
    text:            h.text,
    title:           h.book_title  ?? h.title  ?? 'Unknown',
    author:          h.book_author ?? h.author ?? '',
    cover_image_url: h.cover_image_url ?? null,
    source_url:      h.url ?? null,
    is_book:         !h.url && !platformDomain(h.book_author ?? h.author ?? ''),
  }))

  const resolved = await Promise.all(
    base.map(async h => ({
      ...h,
      cover_image_url: await resolveImage(h),
    }))
  )

  return resolved
}
