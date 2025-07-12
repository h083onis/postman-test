const fs = require('fs');
const Converter = require('openapi-to-postmanv2');

const filePath = './coordinator.yaml';
const readFileData = fs.readFileSync(filePath, { encoding: 'utf8' });

const options = {
  folderStrategy: 'Tags',
  includeAuthInfoInExample: false
};

Converter.convert({ type: 'string', data: readFileData }, options, (err, conversionResult) => {
  if (err) {
    console.error('変換中にエラーが発生:', err);
    return;
  }

  if (!conversionResult.result) {
    console.error('変換失敗:', conversionResult.reason);
    return;
  }

  const converted = conversionResult.output[0].data;
  fs.writeFileSync('postman-collections2.json', JSON.stringify(converted, null, 2));
  console.log('✅ postman-collections.json を生成しました');
});
