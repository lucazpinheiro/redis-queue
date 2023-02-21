import { createClient } from 'redis'

type TimeInSeconds = number

const JOB_KEEP_ALIVE_TIME: TimeInSeconds = 120

const QUEUE_KEY = 'jobs:queue'

const BASE_JOB_KEY = 'job:'

const client = createClient({
  url: 'redis://localhost:6379'
})

function getTimestamp(date: string = ''): number {
  const first = new Date('1970-01-01').getTime()
  if (date === '') {
    const end = new Date().getTime()
    return (end-first) / 1000
  }
  const end = new Date(date).getTime()
  return (end-first) / 1000
}

async function next() {
  const elem = await client.zPopMin(QUEUE_KEY)
  if (elem) {
    return elem.value
  }
}

async function isJobRunning(key: string) {
  const job = await client.keys(BASE_JOB_KEY + key)
  console.log(BASE_JOB_KEY + key)
  console.log(job)
}

async function lock(key: string) {
  await client.set(BASE_JOB_KEY + key, '')
}

async function removeConcludedJob(key: string) {
  await client.del(BASE_JOB_KEY + key)
}

async function main() {
  await client.connect()

  await client.zAdd(QUEUE_KEY, {
    score: getTimestamp(),
    value: 'x'
  })
  await client.zAdd(QUEUE_KEY, {
    score: getTimestamp('1980-01-01'),
    value: 'y'
  })
  await client.zAdd(QUEUE_KEY, {
    score: getTimestamp('2000-01-01'),
    value: 'z'
  })

  const elem = await next()

  if (elem) {
    await lock(elem)
  }

  await client.disconnect()
}

main()
