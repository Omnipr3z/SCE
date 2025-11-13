@echo off
setlocal enabledelayedexpansion

:: Assistant interactif pour créer un commit Git multi-lignes.
::
:: USAGE:
:: Lance simplement "commit.bat" et suis les instructions.

:: --- 1 & 2. Demander le titre ---
echo.
set /p "TITLE=Titre du commit: "
if "!TITLE!"=="" (
    echo [ERREUR] Le titre ne peut pas etre vide.
    exit /b 1
)

:: --- 3 & 4. Demander les lignes de description en boucle ---
echo.
echo Entrez les lignes de description une par une.
echo Laissez vide et appuyez sur Entree pour terminer.
echo.

set "ALL_MESSAGES=-m "!TITLE!""
set "DESC_LINES="
set /a line_num=1

:description_loop
set "LINE="
set /p "LINE=[Ligne !line_num!]: "

if "!LINE!"=="" goto :compose_commit

set "ALL_MESSAGES=!ALL_MESSAGES! -m "!LINE!""
set "DESC_LINES=!DESC_LINES!!LINE!
"
set /a line_num+=1
goto :description_loop

:compose_commit
:: --- 5. Composer et afficher la commande finale pour confirmation ---
cls
echo.
echo --- COMMIT A VALIDER ---
echo.
echo Titre: !TITLE!
echo.
echo Description:
if defined DESC_LINES (
    echo !DESC_LINES!
) else (
    echo (aucune)
)
echo ------------------------
echo.
echo Commande qui sera executee :
echo git commit !ALL_MESSAGES!
echo.

:: --- 6. Demander la confirmation ---
set /p "CONFIRM=Confirmez-vous le commit ? (y/N): "

if /i "!CONFIRM!"=="y" (
    echo.
    echo [INFO] Execution du commit...
    git commit !ALL_MESSAGES!
) else (
    echo.
    echo [INFO] Commande annulee.
)

endlocal