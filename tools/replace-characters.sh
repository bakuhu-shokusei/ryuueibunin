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
  {}
