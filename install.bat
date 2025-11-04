@echo off
echo Installing Rarity Agency Landing Page dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

REM Install dependencies
echo.
echo Installing npm dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
echo.
pause
