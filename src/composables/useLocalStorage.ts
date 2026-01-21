import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  let storedValue: T = defaultValue

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        storedValue = JSON.parse(item) as T
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`Failed to read from localStorage key "${key}":`, error)
    }
    storedValue = defaultValue
  }

  const value = ref<T>(storedValue)

  watch(
    value,
    newValue => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn(`Failed to write to localStorage key "${key}":`, error)
        }
      }
    },
    { deep: true }
  )

  return value
}
