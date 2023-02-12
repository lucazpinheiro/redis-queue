import { createClient } from 'redis'

type TimeInSeconds = number

const CACHE_DURATION: TimeInSeconds = 120

const client = createClient({
  url: 'redis://localhost:6379'
})

async function main() {
  await client.connect()
  await client.set('key', 'ablublublé')
  console.log(await client.get('key'))
  await client.disconnect()
}

main()