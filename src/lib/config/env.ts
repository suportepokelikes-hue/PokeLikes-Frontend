const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/v1',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Instabarato',
} as const;

export function getPublicEnv() {
  return env;
}
