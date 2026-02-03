@echo off
echo ========================================
echo ETHxPokemon Mode Switcher
echo ========================================
echo.
echo Current setup:
echo 1. LOCAL MODE  (uses localStorage)
echo 2. BLOCKCHAIN MODE (uses Web3/MetaMask)
echo.
set /p mode="Select mode (1 or 2): "

if "%mode%"=="1" (
    echo.
    echo Switching to LOCAL MODE...
    echo This will use localStorage instead of blockchain.
    echo.

    REM Switch to local mode
    powershell -Command "(Get-Content mint.html) -replace '<script src=\"js/web3.js\"></script>', '<!-- <script src=\"js/web3.js\"></script> -->' | Set-Content mint.html"
    powershell -Command "(Get-Content mint.html) -replace '<script src=\"js/mint.js\"></script>', '<!-- <script src=\"js/mint.js\"></script> -->' | Set-Content mint.html"
    powershell -Command "(Get-Content mint.html) -replace '<!-- <script src=\"js/storage.js\"></script> -->', '<script src=\"js/storage.js\"></script>' | Set-Content mint.html"
    powershell -Command "(Get-Content mint.html) -replace '<!-- <script src=\"js/mint-local.js\"></script> -->', '<script src=\"js/mint-local.js\"></script>' | Set-Content mint.html"

    echo SUCCESS! Switched to LOCAL MODE
    echo Your app will now use localStorage.

) else if "%mode%"=="2" (
    echo.
    echo Switching to BLOCKCHAIN MODE...
    echo This will use Web3 and MetaMask.
    echo.
    echo IMPORTANT: Make sure you have:
    echo - Deployed contracts on Remix
    echo - Updated contract addresses in js/web3.js
    echo.

    REM Switch to blockchain mode
    powershell -Command "(Get-Content mint.html) -replace '<!-- <script src=\"js/web3.js\"></script> -->', '<script src=\"js/web3.js\"></script>' | Set-Content mint.html"
    powershell -Command "(Get-Content mint.html) -replace '<!-- <script src=\"js/mint.js\"></script> -->', '<script src=\"js/mint.js\"></script>' | Set-Content mint.html"
    powershell -Command "(Get-Content mint.html) -replace '<script src=\"js/storage.js\"></script>', '<!-- <script src=\"js/storage.js\"></script> -->' | Set-Content mint.html"
    powershell -Command "(Get-Content mint.html) -replace '<script src=\"js/mint-local.js\"></script>', '<!-- <script src=\"js/mint-local.js\"></script> -->' | Set-Content mint.html"

    echo SUCCESS! Switched to BLOCKCHAIN MODE
    echo Your app will now use Web3/MetaMask.
    echo.
    echo Next steps:
    echo 1. Deploy contracts on Remix
    echo 2. Update js/web3.js with contract addresses
    echo 3. Open mint.html and connect MetaMask

) else (
    echo Invalid selection. Please run again and choose 1 or 2.
)

echo.
pause
