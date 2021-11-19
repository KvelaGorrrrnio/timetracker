export interface IAction {
  kind: Action
  timestamp: number
}

export enum Action {
  Start,
  Pause,
  Resume,
  Stop,
}

export type PauseObject = {
  start: number
  stop: number | undefined
}

export function isValidAction(action: Action, lastAction?: Action): boolean {
  switch (action) {
    case Action.Start:
      return lastAction === undefined
    case Action.Pause:
      return [Action.Start, Action.Resume].includes(lastAction!)
    case Action.Resume:
      return [Action.Pause].includes(lastAction!)
    case Action.Stop:
      return [Action.Start, Action.Pause, Action.Resume].includes(lastAction!)
  }
}

export function applyAction(action: IAction, actions: IAction[]): IAction[] {
  switch (action.kind) {
    case Action.Start:
      return applyStartAction(action, actions)
    case Action.Pause:
      return applyPauseAction(action, actions)
    case Action.Resume:
      return applyResumeAction(action, actions)
    case Action.Stop:
      return applyStopAction(action, actions)
  }
}

function applyStartAction(action: IAction, actions: IAction[]): IAction[] {
  if (actions.length > 0) {
    return actions
  }
  return [...actions, action]
}

function applyPauseAction(action: IAction, actions: IAction[]): IAction[] {
  const lastAction = actions.slice(-1)[0]
  if ([undefined, Action.Stop].includes(lastAction.kind)) {
    return actions
  }
  return [...actions, action]
}

function applyResumeAction(action: IAction, actions: IAction[]): IAction[] {
  const lastAction = actions.slice(-1)[0]
  if (lastAction?.kind !== Action.Pause) {
    return actions
  }
  return [...actions, action]
}

function applyStopAction(action: IAction, actions: IAction[]): IAction[] {
  const lastAction = actions.slice(-1)[0]
  if (lastAction?.kind === Action.Pause) {
    const resumeAction = { kind: Action.Resume, timestamp: action.timestamp }
    return [...actions, resumeAction, action]
  } else if (lastAction?.kind === Action.Stop) {
    return actions
  }
  return [...actions, action]
}

export function normalizeActions(actions: IAction[]): IAction[] {
  return actions.reduce((newActions: IAction[], action: IAction) => applyAction(action, newActions), [])
}

export function getPauses(actions: IAction[]): PauseObject[] {
  const pauses = []
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    if (action?.kind !== Action.Pause) {
      continue
    }
    const nextAction = actions[i + 1]
    pauses.push({
      start: action.timestamp,
      stop: nextAction?.timestamp,
    })
  }
  return pauses
}
