const fs   = require('fs');
const path = require('path');
const newman = require('newman');

const COLLECTION_FILE = path.resolve(__dirname, 'postman-collections.json');
const VARIABLES_FILE  = path.resolve(__dirname, 'variables.json');
const ENV_FILE        = path.resolve(__dirname, 'env.json');

const collection = require(COLLECTION_FILE);
const variables  = require(VARIABLES_FILE);
const envTemplate = require(ENV_FILE);

(async () => {
  for (const [folderName, cases] of Object.entries(variables)) {
    console.log(`\n=== テスト開始: ${folderName} (${cases.length}ケース) ===`);
      // 環境設定にトークンをセット（必要なら他の環境変数もここで設定可）
    await new Promise((resolve, reject) => {
      newman.run({
        collection,
        folder: folderName,
        environment: envTemplate,
        iterationData: cases,
        reporters: ['cli', 'json'],
        reporter: {
          json: { export: `newman-${folderName}.json` }
        }
      })
      .on('beforeRequest', (err, args) => {
        console.log("ok3");
        // args.request は Node の http.ClientRequest
        // ここで動的にヘッダをいじれる（例：token が空なら Authorization を外す）
        console.log(args);
        const envToken = args.environment.values.find(v => v.key === 'token').value;
        const iterToken = args.cursor.iterationData.get('token');
        const tok = (typeof iterToken !== 'undefined') ? iterToken : envToken;
        console.log('→ Calling:', args.request.url.toString());
        const headers = args.request.headers;
        if (tok) {
          headers.upsert({ key: 'Authorization', value: `Bearer ${tok}` });
        } else {
          headers.remove('Authorization');
        }
      })
      .on('request', (err, args) => {
        const actual = args.response.code;
        const exp    = args.cursor.iterationData.get('expectedStatus');
        if (actual !== exp) {
          console.error(`✘ 失敗: 期待 ${exp} だが 実際 ${actual}`);
        } else {
          console.log(`✔︎ 成功: ステータス ${actual}`);
        }
      })
      .on('done', (err, summary) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  console.log('\n✅ 全テスト完了');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
