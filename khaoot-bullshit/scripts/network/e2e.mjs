import { spawnSync } from 'node:child_process';
import { loadLocalEnvironment, projectRoot, testDatabaseUrl } from '../database/environment.mjs';
loadLocalEnvironment();
const env = { ...process.env, NODE_ENV: 'test', DATABASE_URL: testDatabaseUrl(process.env.TEST_DATABASE_URL), ROOM_TOKEN_SECRET: 'b'.repeat(64),
  HOST: '127.0.0.1', PORT: '4173', PUBLIC_ORIGIN: 'http://127.0.0.1:4173', SERVE_WEB: 'true', LOG_LEVEL: 'warn' };
for (const args of [['scripts/database/prisma.mjs', 'migrate', 'deploy'], ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)]]) {
  const result = spawnSync(process.execPath, args, { cwd: projectRoot, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) { process.exitCode = result.status ?? 1; break; }
}
