import { useEffect } from 'react'

const BASE = 'Realwood Furnishers'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} | Transforming Spaces, Enriching Lives`
  }, [title])
}
