@echo off
setlocal

REM ==================================================
title ScreenSavy - Portable Edition
REM ==================================================

echo ========================================
echo   ScreenSavy - Portable Edition
echo ========================================
echo.

REM Resolve script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Locate portable Node.js
set "NODE_DIR=%SCRIPT_DIR%node"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

if not exist "%NODE_EXE%" (
    echo ERROR: Portable Node.js not found!
    echo Place the extracted Node.js files in the node\ folder next to this script.
    echo.
    pause
    exit /b 1
)

echo [OK] Portable Node.js found
"%NODE_EXE%" --version

echo.
REM Add portable Node.js to PATH for this session
set "PATH=%NODE_DIR%;%PATH%"

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

set "NODE_MODULES_DIR=%APP_DIR%\node_modules"
set "BUILD_DIR=%APP_DIR%\.next"

cd /d "%APP_DIR%"

REM Install dependencies on first launch
if not exist "%NODE_MODULES_DIR%" (
    echo First run detected.
    echo Installing dependencies... This may take several minutes.
    echo.
    call "%NPM_CMD%" install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
)

REM Build production bundle if missing
if not exist "%BUILD_DIR%" (
    echo Creating production build...
    echo.
    call "%NPM_CMD%" run build
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to create production build.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Production build created successfully!
    echo.
)

echo Starting ScreenSavy...
echo.
echo Application will be available at: http://127.0.0.1:3000
echo Browser will open automatically in a few seconds.
echo.
echo To stop the server:
echo   - Close this window
echo   - Or press Ctrl+C
echo.
echo ========================================
echo.

REM Open browser after a few seconds
start cmd /c "timeout /t 5 /nobreak >nul && start http://127.0.0.1:3000"

REM Start the Next.js server in the foreground
echo [OK] Starting server...
echo Browser will open automatically in 5 seconds.
echo.
echo IMPORTANT: Closing this window will stop the server!
echo Press Ctrl+C to stop
echo.
echo ========================================
call "%NPM_CMD%" run start

echo.
echo Server stopped. Goodbye!

endlocal
