#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const command = process.argv[2]
const extraArgs = process.argv.slice(3)

const commands = new Set([
  'config',
  'down',
  'logs',
  'ps',
  'refresh',
  'reset',
  'restart',
  'stop',
  'up',
])

if (!commands.has(command)) {
  console.error(
    `Usage: pnpm infra:<command>\n\nCommands: ${Array.from(commands).join(', ')}`,
  )
  process.exit(1)
}

const target = process.env.MEA_INFRA_TARGET ?? 'local'
const projectName =
  process.env.MEA_INFRA_PROJECT ?? `meeting-execution-agent-${target}`
const envFile =
  process.env.MEA_INFRA_ENV_FILE ?? (target === 'vps' ? '.env.vps' : undefined)

if (envFile && !existsSync(envFile)) {
  console.error(
    `Missing ${envFile}. Create it from .env.vps.example or set MEA_INFRA_ENV_FILE.`,
  )
  process.exit(1)
}

const composeBaseArgs = ['compose', '-p', projectName]

if (envFile) {
  composeBaseArgs.push('--env-file', envFile)
}

composeBaseArgs.push('-f', 'infra/compose.db.yml')

const commandArgs = {
  config: ['config'],
  down: ['down'],
  logs: ['logs', '-f'],
  ps: ['ps'],
  reset: ['down', '-v'],
  restart: ['restart'],
  stop: ['stop'],
  up: ['up', '-d'],
}

if (command === 'refresh') {
  runDocker([...composeBaseArgs, 'pull', ...extraArgs])
  runDocker([
    ...composeBaseArgs,
    'up',
    '-d',
    '--force-recreate',
    '--remove-orphans',
    ...extraArgs,
  ])
  process.exit(0)
}

runDocker([...composeBaseArgs, ...commandArgs[command], ...extraArgs])

function runDocker(args) {
  const result = spawnSync('docker', args, {
    stdio: 'inherit',
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
