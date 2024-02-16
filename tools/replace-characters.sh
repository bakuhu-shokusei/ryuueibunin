export LANG=ja_JP.UTF-8
git diff --name-only --cached | xargs -i \
  sed -i \
  -e "s/曰/日/g" \
  -e "s/縁〓詰/縁頬詰/g" \
  -e "s/ヨ〓/ヨリ/g" \
  -e "s|ヨ=|ヨリ|g" \
  -e "s|）|)|g" \
  -e "s|（|(|g" \
  -e "s|江組替|え組替|g" \
  -e "s|逼寒|逼塞|g" \
  -e "s|伯.守|伯耆守|g" \
  -e "s|〓女$|采女|g" \
  -e "s|江割入|え割入|g" \
  -e "s|見〓|見𢌞|g" \
  -e "s|見廻|見𢌞|g" \
  -e "s|支〓$|支配|g" \
  -e "s|御〓下|御廊下|g" \
  -e "s|石兒守|石見守|g" \
  -e "s|惣〓|惣領|g" \
  -E "s#(子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)月日#\1 月 日#g" \
  {}
# fd -e txt -e yml -x sed -i -e "s#月 日光#月日光#g" 
