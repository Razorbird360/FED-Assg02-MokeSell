export const BASE_PATH = typeof import.meta.env !== 'undefined' && import.meta.env.BASE_URL?.startsWith('/')
  ? import.meta.env.BASE_URL
  : "/";