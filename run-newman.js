const fs   = require('fs');
const path = require('path');
const newman = require('newman');

// --- 入出力ファイル定義 ---
const COLLECTION_FILE = path.resolve(__dirname, 'postman-collections.json');
const VARIABLES_FILE  = path.resolve(__dirname, 'variables.json');
const ENV_FILE = path.resolve(__dirname, 'env.json');

// コレクションと変数データのロード
const collection = require(COLLECTION_FILE);
const variables  = require(VARIABLES_FILE);
const envTemplate = require(ENV_FILE);

(async () => {
  for (const [folderName, cases] of Object.entries(variables)) {
    console.log(`\n=== テスト開始: ${folderName} (${cases.length} ケース) ===`);
    await new Promise((resolve, reject) => {
      newman.run({
        collection,
        folder: folderName,          // このフォルダ（またはリクエスト）だけ実行
        environment: envTemplate,
        iterationData: cases,        // 変数セットをイテレーションに
        reporters: ['cli', 'json'],
        reporter: {
          json: { export: `newman-${folderName}.json` }
        },
      }, (err, summary) => {
        if (err) return reject(err);
        const stats = summary.run.stats;
        console.log(`→ 完了：Iterations ${stats.iterations.total}, Assertions Failed ${stats.assertions.failed}`);
        resolve();
      });
    });
  }
  console.log('\n✅ 全フォルダのテストが完了しました');
})().catch(err => {
  console.error('Error running newman:', err);
  process.exit(1);
});
