import type { Locale, Dictionary } from '@/types/i18n'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  el: () => import('./dictionaries/el.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dict = await dictionaries[locale]()
  return dict as Dictionary
}
