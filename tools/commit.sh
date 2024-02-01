node ./tools/check-type.js
sh ./tools/format-yaml.sh
git add .
git commit -m "$1"
