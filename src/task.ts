import { Session, SessionObject } from './session'
import { Action } from './action'

export type TaskObject = {
  name: string
  sessions: SessionObject[]
}

export class Task {
  name: string
  sessions: Session[]

  constructor(name: string, sessions?: Session[]) {
    this.name = name
    this.sessions = sessions ?? []
  }

  static fromObject(task: TaskObject): Task {
    return new Task(task.name, task.sessions.map(Session.fromObject))
  }

  private hasUnfinishedSession(): boolean {
    const lastSession = this.getSession()
    return lastSession instanceof Session && lastSession.state() !== Action.Stop
  }

  getSession(): Session | undefined {
    return this.sessions.slice(-1)[0]
  }

  startSession(timestamp?: number): void | never {
    if (this.hasUnfinishedSession()) {
      throw new Error(`An unfinished session exists for the task '${this.name}'.`)
    }
    const session = new Session()
    session.start(timestamp)
    this.sessions.push(session)
  }

  pauseSession(timestamp?: number): void | never {
    const session = this.getSession()
    if (session === undefined) {
      throw new Error(`No session for the task '${this.name}' has been started.`)
    }
    session.pause(timestamp)
  }

  resumeSession(timestamp?: number): void | never {
    const session = this.getSession()
    if (session === undefined) {
      throw new Error(`No session for the task '${this.name}' has been started.`)
    }
    session.resume(timestamp)
  }

  stopSession(timestamp?: number): void | never {
    const session = this.getSession()
    if (session === undefined) {
      throw new Error(`No session for the task '${this.name}' has been started.`)
    }
    session.stop(timestamp)
  }
}
