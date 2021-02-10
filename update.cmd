set /p id=comment:
git add .
git commit -m "%id%"
git push -u origin main
pause