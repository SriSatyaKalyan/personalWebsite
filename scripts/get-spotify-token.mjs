/**
 * Run once to obtain your Spotify refresh token:
 *   node scripts/get-spotify-token.mjs
 *
 * Prerequisites:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add http://localhost:5173/callback as a Redirect URI in the app settings
 *   3. Copy Client ID + Client Secret into your .env file first
 *   4. Run this script — it will open a browser URL for you to authorise
 *   5. After redirect, paste the full callback URL back into the terminal
 *   6. The refresh token will be printed — paste it into .env
 */

import * as readline from 'readline'
import * as http from 'http'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath   = path.join(__dirname, '..', '.env')

// Read existing .env
let envContent = ''
try { envContent = fs.readFileSync(envPath, 'utf-8') } catch {}

function getEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'))
  return match ? match[1].trim() : process.env[key] || ''
}

const CLIENT_ID     = getEnv('VITE_SPOTIFY_CLIENT_ID')
const CLIENT_SECRET = getEnv('VITE_SPOTIFY_CLIENT_SECRET')
const REDIRECT_URI  = 'http://localhost:5173/callback'
const SCOPES        = 'user-top-read user-read-currently-playing user-read-playback-state'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌  Set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in your .env first.')
  process.exit(1)
}

const authUrl =
  `https://accounts.spotify.com/authorize?` +
  `client_id=${CLIENT_ID}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}`

console.log('\n🎵  Open this URL in your browser and authorise the app:\n')
console.log(authUrl)
console.log()

// Try to open automatically
try { execSync(`open "${authUrl}"`) } catch {}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('📋  Paste the full callback URL here: ', async (callbackUrl) => {
  rl.close()
  const code = new URL(callbackUrl).searchParams.get('code')
  if (!code) { console.error('❌  No code found in URL.'); process.exit(1) }

  const body = new URLSearchParams({
    grant_type:   'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body,
  })

  const data = await res.json()
  if (!data.refresh_token) {
    console.error('❌  Failed to get refresh token:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  console.log('\n✅  Refresh token obtained!\n')
  console.log('Add this to your .env:\n')
  console.log(`VITE_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`)

  // Auto-write to .env if the key doesn't already have a real value
  if (!envContent.match(/^VITE_SPOTIFY_REFRESH_TOKEN=(?!your_).+$/m)) {
    const updated = envContent.includes('VITE_SPOTIFY_REFRESH_TOKEN=')
      ? envContent.replace(/^VITE_SPOTIFY_REFRESH_TOKEN=.+$/m, `VITE_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`)
      : envContent + `\nVITE_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`
    fs.writeFileSync(envPath, updated)
    console.log('✅  Also written to .env automatically.')
  }
})
