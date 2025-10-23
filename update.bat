@echo off
setlocal EnableDelayedExpansion

REM ==================================================
title ScreenSavy - Update
REM ==================================================

echo ========================================
echo   ScreenSavy - Update
echo ========================================
echo.

REM Resolve script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Default paths
set "NODE_DIR=%SCRIPT_DIR%node"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD="
set "PORTABLE_MODE="

if exist "%NODE_EXE%" (
    echo [Portable Mode] Using portable Node.js
    "%NODE_EXE%" --version
    echo.
    set "PATH=%NODE_DIR%;%PATH%"
    set "NPM_CMD=%NODE_DIR%\npm.cmd"
    set "PORTABLE_MODE=1"
) else (
    echo [Standard Mode] Checking for system Node.js and Git

    where git >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Git not found!
        echo.
        echo Please install Git from https://git-scm.com/
        echo.
        pause
        exit /b 1
    )

    where node >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Node.js not found!
        echo.
        echo Please install Node.js from https://nodejs.org/
        echo.
        pause
        exit /b 1
    )

    echo Node.js found:
    node --version
    echo.

    set "NPM_CMD=npm"
)

REM Determine application directory (supports root or app\ layouts)
if exist "%SCRIPT_DIR%package.json" (
    set "APP_DIR=%SCRIPT_DIR%"
) else if exist "%SCRIPT_DIR%app\package.json" (
    set "APP_DIR=%SCRIPT_DIR%app"
) else (
    echo ERROR: Could not locate package.json for ScreenSavy.
    echo Ensure the project files are placed next to this script or inside app\.
    echo.
    pause
    exit /b 1
)

cd /d "%APP_DIR%"

set "REPO_SLUG=timoncool/ScreenSavy.com"
set "ARCHIVE_URL=https://github.com/%REPO_SLUG%/archive/refs/heads/main.zip"

echo Step 1/4: Getting latest changes...
echo.

if exist ".git" (
    echo Updating via Git...
    echo.
    git pull
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to run git pull.
        echo You may have unsaved changes.
        echo.
        pause
        exit /b 1
    )
) else (
    echo Downloading latest version from GitHub...
    echo.

    set "TEMP_ZIP=%APP_DIR%\temp_update.zip"
    set "TEMP_DIR=%APP_DIR%\temp_update"

    curl -L -o "%TEMP_ZIP%" "%ARCHIVE_URL%"
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to download update.
        echo Check your internet connection.
        echo.
        pause
        exit /b 1
    )

    powershell -command "Expand-Archive -Path '%TEMP_ZIP%' -DestinationPath '%TEMP_DIR%' -Force"
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to extract archive.
        del "%TEMP_ZIP%"
        pause
        exit /b 1
    )

    for /d %%I in ("%TEMP_DIR%\*") do set "EXTRACTED_DIR=%%I"

    if not defined EXTRACTED_DIR (
        echo.
        echo ERROR: Could not locate extracted project directory.
        del "%TEMP_ZIP%"
        rmdir /S /Q "%TEMP_DIR%"
        pause
        exit /b 1
    )

    echo Copying new files...
    xcopy "!EXTRACTED_DIR!\*" "%APP_DIR%" /E /Y /I >nul
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to copy files.
        del "%TEMP_ZIP%"
        rmdir /S /Q "%TEMP_DIR%"
        pause
        exit /b 1
    )

    del "%TEMP_ZIP%"
    rmdir /S /Q "%TEMP_DIR%"
    echo Update downloaded successfully.
)

echo.
echo Step 2/4: Updating dependencies...
echo.
call "%NPM_CMD%" install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to update dependencies.
    pause
    exit /b 1
)

echo.
echo Step 3/4: Cleaning old build...
echo.
if exist ".next" (
    rmdir /S /Q ".next"
    echo Old build deleted.
) else (
    echo No previous build detected.
)

echo.
echo Step 4/4: Creating new production build...
echo.
call "%NPM_CMD%" run build
if errorlevel 1 (
    echo.
    echo ERROR: Failed to create new build.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Update completed successfully!
echo ========================================
echo.
echo You can now run the updated version using start.bat.
if defined PORTABLE_MODE (
    echo (Portable Node.js detected)
) else (
    echo (System Node.js will be used)
)
echo.
pause

endlocal
