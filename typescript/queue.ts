import { createClient } from 'redis'

type Job = {
  id: string
  topic: number
}

const QUEUE = 'work:queue:ids'

const client = createClient({
  url: 'redis://localhost:6379'
})

async function connect() {
  await client.connect()
}

async function push(j: Job): Promise<boolean> {
  try {
    await client.lPush(QUEUE, JSON.stringify(j))
    return true
  } catch (error) {
    return false
  }
}

async function next(): Promise<Job|null> {
  try {
    const job = await client.rPop(QUEUE)
    if (job) {
      return JSON.parse(job)
    }
    return null
  } catch (error) {
    return null
  }
}