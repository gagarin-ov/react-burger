#!/bin/bash
npm run build
scp -r ./dist/* praktikum@ovgpraktikum.ru:/var/www/myapp/
echo "Готово!" 