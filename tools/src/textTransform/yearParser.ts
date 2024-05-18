// 十干
const kan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 十二支
const shi = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
]

// 六十干支
const kanshi = Array.from({ length: 60 }).map((_, idx) => {
  return `${kan[idx % 10]}${shi[idx % 12]}`
})

const nengou: Array<[string, number]> = [
  ['慶長', 19],
  ['元和', 9],
  ['寛永', 20],
  ['正保', 4],
  ['慶安', 4],
  ['承應', 3],
  ['明曆', 3],
  ['萬治', 3],
  ['寛文', 12],
  ['延寶', 8],
  ['天和', 3],
  ['貞享', 4],
  ['元祿', 16],
  ['寶永', 7],
  ['正德', 5],
  ['享保', 20],
  ['元文', 5],
  ['寛保', 3],
  ['延享', 4],
  ['寛延', 3],
  ['寶曆', 13],
  ['明和', 8],
  ['安永', 9],
  ['天明', 8],
  ['寛政', 12],
  ['享和', 3],
  ['文化', 14],
  ['文政', 12],
  ['天保', 14],
  ['弘化', 4],
  ['嘉永', 6],
  ['安政', 6],
  ['萬延', 1],
  ['文久', 3],
  ['元治', 1],
  ['慶應', 4],
]

const YEAR_NUMBERS: string[][] = [
  ['元'],
  ['二'],
  ['三'],
  ['四'],
  ['五'],
  ['六'],
  ['七'],
  ['八'],
  ['九'],
  ['十'],
  ['十一'],
  ['十二'],
  ['十三'],
  ['十四'],
  ['十五'],
  ['十六'],
  ['十七'],
  ['十八'],
  ['十九'],
  ['二十', '廿'],
  ['二十一', '廿一'],
]

const map = (() => {
  let year = 1596
  let x = kanshi.indexOf('丙申')
  const map: Record<
    string,
    { year: number; kanshi: string; textYears: string[] }[]
  > = {}
  nengou.forEach(([name, duration]) => {
    map[name] = []
    for (let i = 0; i < duration; i++) {
      map[name].push({
        year,
        kanshi: kanshi[x],
        textYears: YEAR_NUMBERS[i],
      })
      year = year + 1
      x = (x + 1) % 60
    }
    // this may not acutally exsit
    map[name].push({
      year,
      kanshi: kanshi[x],
      textYears: YEAR_NUMBERS[duration],
    })
  })
  return map
})()

export function transformNote(s: string): string {
  const nengouReg =
    /^(慶長|元和|寛永|正保|慶安|承應|明曆|萬治|寛文|延寶|天和|貞享|元祿|寶永|正德|享保|元文|寛保|延享|寛延|寶曆|明和|安永|天明|寛政|享和|文化|文政|天保|弘化|嘉永|安政|萬延|文久|元治|慶應)((元|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|廿|二十一|廿一){1,2})(〔(子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)脱?〕|子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)/
  const match = s.match(nengouReg)
  if (match) {
    const [text, nengo, yearKanji, shi] = match
    for (const key of Object.keys(map)) {
      if (key === nengo) {
        for (const x of map[key]) {
          for (const textYear of x.textYears) {
            if (text.startsWith(`${key}${textYear}${x.kanshi[1]}`)) {
              return s.replace(
                text,
                `<span class="ja-year">${text}</span><span class="uni-year">(${x.year})</span>`
              )
            }
          }
        }
        // 年数と干支一合わない
        let index = YEAR_NUMBERS.findIndex((i) => i.includes(yearKanji))
        // 年数だけ合う（えとを無視）
        if (index >= 0) {
          if (index >= map[key].length) {
            // index = map[key].length - 1
            continue
          }
          const x = map[key][index]
          return s.replace(
            text,
            `<span class="ja-year">${text}</span><span class="uni-year not-match">(${x.year}?)</span>`
          )
        }
      }
      continue
    }
    return s.replace(text, `<span class="ja-year">${text}</span>`)
  } else {
    return s
  }
}
