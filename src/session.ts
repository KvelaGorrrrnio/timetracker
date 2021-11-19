import { IAction, Action, isValidAction, applyAction, normalizeActions, getPauses, PauseObject } from './action'

export type SessionObject = {
  actions: IAction[]
}

export class Session {
  actions: IAction[] = []

  constructor(actions: IAction[] = []) {
    this.actions = actions
  }

  static fromObject(session: SessionObject): Session {
    return new Session(normalizeActions(session.actions))
  }

  start(timestamp?: number): void | never {
    const state = this.state()
    if (!isValidAction(Action.Start, state)) {
      throw new Error(`Start is not a valid action right now.`)
    }
    this.addAction(Action.Start, timestamp)
  }

  pause(timestamp?: number): void | never {
    const state = this.state()
    if (!isValidAction(Action.Pause, state)) {
      throw new Error(`Pause is not a valid action right now.`)
    }
    this.addAction(Action.Pause, timestamp)
  }

  resume(timestamp?: number): void | never {
    const state = this.state()
    if (!isValidAction(Action.Resume, state)) {
      throw new Error(`Resume is not a valid action right now.`)
    }
    this.addAction(Action.Resume, timestamp)
  }

  stop(timestamp?: number): void | never {
    const state = this.state()
    if (!isValidAction(Action.Stop, state)) {
      throw new Error(`Stop is not a valid action right now.`)
    }
    this.addAction(Action.Stop, timestamp)
  }

  getStart(): number | undefined {
    return this.actions[0]?.timestamp
  }

  getStop(): number | undefined {
    return this.actions.slice(-1)[0]?.timestamp
  }

  getPauses(): PauseObject[] {
    return getPauses(this.actions)
  }

  state(): Action | undefined {
    if (this.actions.length === 0) {
      return undefined
    }
    return this.actions.slice(-1)[0].kind
  }

  private addAction(kind: Action, timestamp: number = Date.now()): IAction {
    const action = { kind, timestamp }
    this.actions = applyAction(action, this.actions)
    return action
  }
}
