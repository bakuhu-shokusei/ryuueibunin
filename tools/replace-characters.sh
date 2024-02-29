export LANG=ja_JP.UTF-8
git diff --name-only --cached | xargs -i \
  sed -i \
  -E 's/曰/日/g
  s/縁〓詰/縁頬詰/g
  s/ヨ〓/ヨリ/g
  s|ヨ=|ヨリ|g
  s|）|)|g
  s|（|(|g
  s|江組替|え組替|g
  s|逼寒|逼塞|g
  s|伯.守|伯耆守|g
  s|〓女$|采女|g
  s|江割入|え割入|g
  s|見〓|見𢌞|g
  s|支〓$|支配|g
  s|御〓下|御廊下|g
  s|石兒守|石見守|g
  s|惣〓|惣領|g
  s#(子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)月日#\1 月 日#g
  s|兀祿|元祿|g
  s|廻|𢌞|g
  s|〓リ|𢌞リ|g
  s|又政|文政|g
  s|○|⭕|g
  s|大保|天保|g
  s|被遺|被遣|g
  s|^大明|天明|g
  s|差和|差扣|g
  s|^又化|文化|g
  s|掛(=|〓)$|掛リ|g
  /^(曰|日|目|戸|E|ヨ|〓)$/d
  ' {}
# fd -e txt -e yml -x sed -i -e "s|^又化|文化|g" 
