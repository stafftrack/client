import 'server-only'
 
const dictionaries: { [key: string]: () => Promise<any> } = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
}
 
// eslint-disable-next-line import/prefer-default-export
export const getDictionary = async (locale: string) => dictionaries[locale]()
