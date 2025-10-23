# ScreenSavy Portable Release Guide

This document describes how to assemble the Windows "portable" build that ships in the GitHub Releases tab. The goal is to let users unpack the archive on any Windows workstation and run ScreenSavy locally without installing Node.js or other tooling.

> **Prerequisites**
>
> * Windows 10/11 PC with PowerShell and GitHub CLI or access to the GitHub website
> * `curl`, `powershell`, and `zip` utilities available in `%PATH%`
> * Enough free disk space to store the Node.js runtime (~80 MB) and dependencies (~300 MB)

## 1. Prepare a clean working directory

1. Clone the repository or update your local copy: `git clone https://github.com/timoncool/ScreenSavy.com.git`.
2. Switch to the `main` branch and pull the latest changes: `git checkout main && git pull`.
3. Remove any previous build artefacts: `rm -rf .next node_modules`.

## 2. Install dependencies and build the app

1. Install production dependencies: `npm install --omit=dev`.
2. Build the production bundle: `npm run build`.
3. Test the build locally: `npm run start` and confirm the site loads on `http://127.0.0.1:3000`.

> If you include the generated `.next` directory and `node_modules` folder inside the release archive the portable start script can launch the site entirely offline.

## 3. Add the portable Node.js runtime

1. Download the Windows x64 ZIP distribution of Node.js (LTS recommended) from [https://nodejs.org/en/download](https://nodejs.org/en/download).
2. Extract the archive next to `start.bat` and rename the folder to `node`. The layout should look like:

   ```text
   ScreenSavy.com-portable/
   ├─ node/
   │  ├─ node.exe
   │  └─ npm.cmd
   ├─ start.bat
   ├─ update.bat
   ├─ package.json
   ├─ .next/
   └─ node_modules/
   ```

3. Keep only the required files to reduce the archive size (remove `node\*.pdb`, docs, and `CHANGELOG` if you need extra savings).

## 4. Verify the portable scripts

1. From Windows Explorer double-click `start.bat`. The script should:
   * detect the bundled Node.js runtime,
   * reuse the cached `node_modules` if present (or install them on first launch),
   * reuse the compiled `.next` output (or build it on first launch), and
   * open the app in the default browser.
2. Run `update.bat` to confirm that both **Git** and **no-Git** update flows work:
   * On a clone that still has the `.git` folder it should call `git pull`.
   * In a clean portable folder (without `.git`) it should download the latest ZIP from GitHub and replace the files.

## 5. Package the archive

1. Create a staging folder (for example `ScreenSavy.com-portable`). Copy the following into it:
   * All project files from the repository root **except** `.git`, `.github`, and other development-only assets.
   * The freshly downloaded `node/` directory.
   * The `.next/` build output and `node_modules/` directory.
   * The `start.bat` and `update.bat` scripts.
2. Compress the folder into a ZIP file: `Compress-Archive -Path ScreenSavy.com-portable -DestinationPath ScreenSavy.com-portable.zip -Force`.
3. Upload the archive as an asset when creating a GitHub release. Mention in the release notes that the bundle contains a portable Node.js runtime and can be run by executing `start.bat`.

## 6. Keep future releases fresh

* Rebuild the application for each release so that `.next/` reflects the tagged commit.
* Refresh the `node/` runtime when Node.js ships security updates.
* Incrementally test `start.bat` and `update.bat` after each change to ensure the scripts stay compatible with the repository layout.

Following the steps above guarantees that Windows users receive a self-contained experience similar to the portable build shared for VideoSOS.
