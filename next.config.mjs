import { execSync } from 'child_process';

// Get git commit hash and build time
const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    return 'unknown';
  }
};

const getGitCommitDate = () => {
  try {
    return execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"').toString().trim();
  } catch (error) {
    return new Date().toISOString();
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'screensavy.com'
      },
      {
        protocol: 'https',
        hostname: 'www.googletagmanager.com'
      }
    ]
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT_HASH: getGitCommitHash(),
    NEXT_PUBLIC_GIT_COMMIT_DATE: getGitCommitDate(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  }
};

export default nextConfig;
