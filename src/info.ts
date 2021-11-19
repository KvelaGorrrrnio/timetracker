import { Session } from './session'

export type SessionInfo = {
  start: number | undefined
  stop: number | undefined
  duration: {
    active: number
    inactive: number
  }
  pauses: bigint
}

export function sessionsInfo(session: Session): SessionInfo {
  const start = session.getStart()
  const stop = session.getStop()
  const pauses = session.getPauses()
  const inactiveDuration = pauses.reduce((duration,{ start, stop }) => duration + ((stop ?? Date.now()) - (start ?? Date.now())), 0)
  return {
    start: session.getStart(),
    stop: session.getStop(),
    duration: {
      active: (stop ?? Date.now()) - (start ?? Date.now()) - inactiveDuration,
      inactive: inactiveDuration,
    },
    pauses: BigInt(pauses.length),
  }
}
