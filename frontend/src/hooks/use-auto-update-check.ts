import { useSyncExternalStore, useCallback } from 'react'

const STORAGE_KEY = 'updateCheckEnabled'

const listeners = new Set<() => void>()

function getSnapshot(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw === null ? true : raw === 'true'
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function notify() {
  listeners.forEach((cb) => cb())
}

export function useAutoUpdateCheck() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => true)

  const setEnabled = useCallback((next: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(next))
    notify()
  }, [])

  return { enabled, setEnabled } as const
}
