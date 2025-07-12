# Postman を活用したAPIテストの説明

## 目次
- [Postman を活用したAPIテストの説明](#postman-を活用したapiテストの説明)
  - [目次](#目次)
  - [Postman とは](#postman-とは)
  - [Postman のインストールと言語設定](#postman-のインストールと言語設定)
    - [利用環境](#利用環境)
    - [言語設定](#言語設定)
  - [基本機能の説明](#基本機能の説明)
    - [コレクションの作成](#コレクションの作成)
    - [リクエストの作成](#リクエストの作成)
    - [テストスクリプトの作成](#テストスクリプトの作成)
    - [リクエストの実行とテスト結果の確認](#リクエストの実行とテスト結果の確認)
  - [MetaMoji Coordinator のテスト](#metamoji-coordinator-のテスト)


## Postman とは
Postman とは Restful API や GraphQLなどの Web API を開発・テスト・ドキュメント化・モニタリングするためのプラットフォームである。以下の特徴を持ち、API テストの効率化やチームでの作業を円滑に実施することが可能だ。

- 直観的なユーザーインターフェース
  
  GUI ベースでリクエスト作成やレスポンス確認が可能となる。curl コマンドやスクリプトを覚える必要がなく、HTTPメソッド（GET/POST/PUT/DELETEなど）やヘッダー、クエリパラメータ、ボディ（JSON/XML、フォームデータ等）の設定が容易である。

- コレクション機能
  
  APIリクエストをグループ化し再利用可能な「コレクション」として保存する。コレクションごとにテストスクリプトや環境変数を設定でき、テストケースの管理やバージョン管理が容易になる。

- 環境変数・グローバル変数
  
  開発／ステージング／本番など、複数の環境ごとにURLや認証情報、共通パラメータを変数として定義する。切り替え一つで同じテストを各環境に対して実行できる。

- 自動化とCI/CD連携
  
  Postman CLI を使うことで、コマンドライン上や CI 環境（GitHub Actions / Jenkins 等）でコレクションを実行し、テストパイプラインに組み込みできる。


## Postman のインストールと言語設定

### 利用環境

Web版とデスクトップ版の両方が存在する

Web 版：https://identity.getpostman.com/login

デスクトップ版：https://www.postman.com/downloads/

### 言語設定

アプリ画面右上から Settings（設定）を開く
  
![設定画面](./img/setting.png)

General（一般）から Application（アプリケーション）内の Language（言語）で日本語を選択する
    
![言語設定](./img/lang-ch.png)

## 基本機能の説明
Postman を使ったAPIテストの基本機能を説明していく。
例として、 Postman 内でリクエストをするためのサービスである [Postman Echo](https://learning.postman.com/docs/developer/echo-api/) を使用する。 

### コレクションの作成

左上の ``新規`` をクリックし、表示される選択肢から ``コレクション`` を選ぶ。

![コレクションの作成](./img/create-collection.png)

「新しいコレクション」という名前でコレクションが作成されたことを確認し、``リクエストを追加`` をクリックする。

![コレクションの作成結果](./img/create-collection-result.png)

### リクエストの作成

HTTP リクエストメソッドとして ``POST`` を選択し、URL として https://postman-echo.com/post を入力する。
https://postman-echo.com/post では、ボディ内に記載した内容がレスポンスで返ってくる仕様になっている。
   
![リクエストメソッドとURL](./img/create-request1.png)

``ボディ`` 内の ``Raw`` を選択し、以下の内容を記載する。

![ボディの編集](./img/create-request2.png)

```json
{
  "company":"MetaMoJi Inc."
}
```

### テストスクリプトの作成

``スクリプト`` 内の ``Post-response`` をクリックし、以下の内容を記載する。

![テストスクリプトの作成](./img/test-script.png)

```javascript
// レスポンスヘッダーの内容をテストするための記述
pm.test("レスポンスヘッダーのテスト", function () {
    pm.expect(pm.response.headers.get("Content-Length")).to.exist;
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});

// レスポンスボディ内の内容をテストするための記述
pm.test("レスポンスボディ内の値をテスト", function () {
    const data = pm.response.json().data;
    pm.expect(data.company).to.equal("MetaMoJi Inc.");
});

// レスポンスのJsonスキーマをテストするための記述
const expectedSchema = {
    "type": "object",
    "properties": {
        "data": {
            "type": "object",
            "properties": {
                "comany": {
                    "type": "string"
                }
            }
        }
    }
};
pm.test('JSONスキーマのテスト', function () {
    pm.response.to.have.jsonSchema(expectedSchema);
});
```

### リクエストの実行とテスト結果の確認

画面右上の ``送信`` をクリックし、リクエストを実行する。
すると、画面下半分にリクエスト実行結果が表示される。
実行結果の中から ``ボディ`` を選択し、レスポンス結果が表示される。

![リクエストの実行](./img/excute.png)

レスポンス結果の中から ``テスト結果`` をクリックし、先ほど記載したテストが実行されていることを確認する。

![テスト結果の確認](./img/test-result.png)



## MetaMoji Coordinator のテスト