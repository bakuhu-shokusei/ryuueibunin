## 「柳営補任」OCRテキスト化

東京大学史料編纂所が提供している「大日本近世史料　柳営補任」の版面画像をウェブサイトにしたプロジェクトです。

クリエイティブ・コモンズ・ライセンスの「CC BY-NC-SA」（[クリエイティブ・コモンズ　表示 - 非営利 - 継承 4.0 国際ライセンス](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja)）の元で提供されている画像をOCRテキストかし、検索できるようにしたものです。

[ウェブサイトURL](https://bakuhu-shokusei.github.io/ryuueibunin/)

### 検索の使い方

「あいまい検索」と「完全一致検索」二つのモードがあります。最大100件の結果が表示されます。

#### あいまい検索

複数の条件で検索できます。例：`代官 伊奈`、`安房守 阿波守`。名前通り、あいまい検索もできます。

#### 完全一致検索

名前通りです。正規表現もサポートしています。

### ディレクトリ構成

```
├── ocr_text 　画像をOCRしたtxtファイル
├── content　　関係性を示すためにtxtから変換したyamlファイル
└── tools　　　yamlファイルをhtmlに変換するプログラム
```

### ローカル開発環境構築

まずは[node.js](https://nodejs.org/)と[yarn](https://yarnpkg.com/)をインストールします。

```bash
cd tools
yarn
yarn tsc
node dist/generateMds.js
yarn docs:dev
```

[http://localhost:5173/ryuueibunin/](http://localhost:5173/ryuueibunin/)を開きます。

### デプロイ

`master`ブランチにプッシュしたら、[自動的にデプロイ](https://github.com/bakuhu-shokusei/ryuueibunin/actions)します。
