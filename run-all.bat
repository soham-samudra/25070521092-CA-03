@echo off
title NexStore Full-Stack Launcher (CA-03)
color 0E
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   Launching NexStore Full-Stack MERN Application
echo ========================================================
echo.
echo [1/2] Starting Backend Server on http://localhost:5000 ...
start "NexStore Backend" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d %~dp0server && node server.js"

echo [2/2] Starting Frontend React Client on http://localhost:5173 ...
start "NexStore Frontend" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d %~dp0client && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Open your browser at: http://localhost:5173
echo.
pause
