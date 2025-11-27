export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)

export const formatDurationHms = (ms: number) => {
  const d = new Date(ms)
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`
}
