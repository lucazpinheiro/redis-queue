import { createClient } from 'redis'

type TimeInSeconds = number

const CACHE_DURATION: TimeInSeconds = 120

const QUEUE_KEY = 'jobs:queue'

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
  const elem = await client.zRange(QUEUE_KEY, 0, 0)
  return {
    job
  }
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

  await next()

  await client.disconnect()
}

main()
