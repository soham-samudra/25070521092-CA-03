@echo off
title NexStore React Client (Port 5173)
color 0B
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   Starting NexStore React Client (Vite)
echo ========================================================
echo.
cd /d "%~dp0client"

call npm run dev
pause
