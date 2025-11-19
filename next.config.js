const { execSync } = require('child_process');

// Function to get git commit hash
const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('Failed to get git commit hash:', e);
    return 'unknown';
  }
};

// Function to get git commit date
const getGitCommitDate = () => {
  try {
    return execSync('git log -1 --format=%cd --date=short').toString().trim();
  } catch (e) {
    console.error('Failed to get git commit date:', e);
    return 'unknown';
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GIT_COMMIT_HASH: getGitCommitHash(),
    NEXT_PUBLIC_GIT_COMMIT_DATE: getGitCommitDate(),
  },
};

module.exports = nextConfig;
