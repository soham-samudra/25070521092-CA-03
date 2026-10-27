@echo off
title NexStore Backend Server (Port 5000)
color 0A
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   Starting NexStore Backend Server with MongoDB Compass
echo ========================================================
echo.
cd /d "%~dp0server"

node server.js
pause
