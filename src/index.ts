import { Task } from './task'
//import { Session } from './session'

const taskObject = {
  name: 'tv2',
  sessions: [],
}

export const sleep = (amount: number) => new Promise(r => setTimeout(r, amount))

function analyzeFull(sessions: any[]) {
  return sessions.reduce((duration, session) => duration + ((session.getStop() ?? Date.now()) - (session.getStart() ?? Date.now())),0)
}

function analyzePauses(sessions: any[]) {
  const pauses = sessions.map((session) => session.getPauses()).flat()
  const amount = pauses.length
  const duration = pauses.reduce((duration: number,{ start, stop }: any) => duration + ((stop ?? Date.now()) - start), 0)
  return { amount, duration }
}

function analyzeWork(sessions: any[]) {
  return analyzeFull(sessions) - analyzePauses(sessions).duration
}

async function main() {

  const task = Task.fromObject(taskObject)
  task.startSession()
  await sleep(2000)
  task.pauseSession()
  await sleep(3000)
  task.resumeSession()
  await sleep(4000)
  task.stopSession()

  console.log('full:   ', analyzeFull(task.sessions))
  console.log('#pause: ', analyzePauses(task.sessions).amount)
  console.log('pause:  ', analyzePauses(task.sessions).duration)
  console.log('work:   ', analyzeWork(task.sessions))
}

main()
