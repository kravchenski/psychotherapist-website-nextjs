
import { createDatabase, createLocalDatabase } from '@tinacms/datalayer'
import { GitHubProvider } from 'tinacms-gitprovider-github'
import { RedisLevel } from 'upstash-redis-level'

const branch = (process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main")

const isLocal =  process.env.TINA_PUBLIC_IS_LOCAL === 'true'
const githubOwner = process.env.GITHUB_OWNER || ''
const githubRepo = process.env.GITHUB_REPO || ''
const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || ''

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
          branch,
          owner: githubOwner,
          repo: githubRepo,
          token: githubToken,
        }),
      databaseAdapter: new RedisLevel({
        redis: {
          url: process.env.KV_REST_API_URL || 'http://localhost:8079',
          token: process.env.KV_REST_API_TOKEN || 'example_token',
        },
        debug: process.env.DEBUG === 'true' || false,
      }) as any,
      namespace: branch,
    })
