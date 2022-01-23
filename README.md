# Express project Documentation

## Reference

### curl

//curl について[https://qiita.com/yasuhiroki/items/a569d3371a66e365316f]
//jq のインストール[https://stedolan.github.io/jq/]

_基本型(｜ jq で、Json を見やすい形に整列しています)_
`$ curl [options] [URL] | jq`
オプション無しだと Get メソッドになる

_POST -X で HTTP メソッドを指定_
`$ curl -X POST [URL] | jq`

_オプション_

### sqllite3 基本メソッド

_データベースの接続_
`new sqlite3.Database(//データベースのパス)`

_内部のクエリを同期的に実行_
`serialize(()=>{//queries})`

_全ての結果を一度に取得_
`all(sql,(err,rows)) `

_SQL クエリを実行_
`get(sql,(err)) `

_データベース接続を終了_
`close()`

### sql 基本

参考[https://qiita.com/n_oshiumi/items/9424ca773b6c0a809e94]

#### SELECT

_SELECT:(このテーブルのこの列を選択)_
SELECT は、列(レコード)を選択します。
FROM は、表(テーブル)を選択します。
全ての列を選択したい場合は、「\*」
`SELECT name, age FROM consumer;`

_WHERE:(このテーブルのこの列のこの条件に当てはまるものを選択)_

ある数値とある数値の間
`BETWEEN ... AND ...`

数字がリストに存在する
`IN ...`

数字がリストに存在しない
`NOT IN... `

大文字小文字を区別しない文字列
`LIKE`

大文字小文字を完全に区別する文字列
`NOT LIKE`

0 個以上の任意の文字 LIKE や NOT LINE の時だけ)　 AN%なら、AN で始まるものならなんでも返してくれる
`%`

ある任意の一文字
`_`

例）「顧客情報」というテーブルの「顧客番号」という列にある、「1 番から 10 番まで」を選択
`SELECT number FROM consumer WHERE BETWEEN 1 AND 10;`

_ORDER BY:ソート_
ASC...昇順
DESC...降順
何も指定しなかったら、勝手に昇順になります。
`SELECT number FROM consumer ORDER BY number DEST;`

_LIMIT OFFSET:ソート_
LIMIT = 表示する行数を指定するもの
OFFSET = 表示を始める場所を決めること
`SELECT number FROM consumer ORDER BY number DEST LIMIT 5 OFFSET 5;`

_内部結合と外部結合_
SQL 素人でも分かるテーブル結合(inner join と outer join)[https://zenn.dev/naoki_mochizuki/articles/60603b2cdc273cd51c59]

#### INSERT 行(新しいデータ)の挿入

INSERT INTO テーブル名(列名, 列名) VALUES (データ, データ, データ...)
`INSERT INTO mytable VALUES (5, 30, "こんにちは")`

#### UPDATE 行の更新

UPDATE はすでにテーブルにある行を修正して、更新します。

UPDATE 　テーブル名
SET 列名=値, 列名=値...
WHERE 条件

```
UPDATE Mytable
SET age=20
WHERE id=5
```

#### DELETE 行の削除

すでにテーブルの中にある行を削除します。

DELETE FROM テーブル名
WHERE 条件

```
DELETE FROM Mytable
WHERE age < 20
```

#### CREATE TABLE

CREATE TABLE Mytable2
列名 データ型　 NULL/NOT NULL

_データ型まとめ_

```
INTEGER　...整数値
BOOLEAN... 真偽値(TRUE or FALSE)
FLOAT, REAL ,DOUBLE... 浮動小数点型
CHARACTER, VARCHAR, TEXT ...テキスト型
DATE, DATETIME ... 日付や時刻
BLOB ... 画像、音声、動画など、テキストでも数値でもないもの
```

_テーブルの制約まとめ_

```
PRIMARY KEY ... テーブルの中でレコード(行)を一つに特定できるカラム(列)のこと。普通のやつ
AUTOINCREMENT...カラムに値が指定されなかった場合に、自動的に値が振り分けられる。データ型は整数。IDみたいに、指定しなくても自動で割り振ってほしいやつに使う
UNIQUE...重複した値が入力されないように制約する
NOT NULL...NULLを格納することはできない
CHECK ... 格納されたデータをチェックして、格納された値が、指定された条件に当てはまるかどうかをテキストで返す。例えば、値が正であるか、特定の接頭辞で始まっているかなど
FOREIGN KEY...データを格納する際に、他のテーブルを参照したとすると、その他のテーブルが外部キーになる。他のテーブルとの整合性チェック
```

_列の追加_

```
ALTER TABLE テーブル名　
ADD 列名　データ型
DEFAULT 初期値;
```

_列の削除_

```
ALTER TABLE テーブル名　
DROP 列名　
```

_テーブル名の変更_

```
ALTER TABLE テーブル名　
RENAME TO 新しいテーブル名
```

_テーブルの削除_

```
ALTER TABLE テーブル名　
RENAME TO 新しいテーブル名
```

## Create users table

```
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  profile TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime
  date_of_birth TEXT
);
```

## Create sample data

`INSERT INTO users (name, profile) VALUES ("Subaru", "エミリアたんマジ天使！");`  
`INSERT INTO users (name, profile) VALUES ("Emilia", "もう、スバルのオタンコナス！");`  
`INSERT INTO users (name, profile) VALUES ("Ram", "いいえお客様、きっと生まれて来たのが間違いだわ");`  
`INSERT INTO users (name, profile) VALUES ("Rem", "はい、スバルくんのレムです。");`  
`INSERT INTO users (name, profile) VALUES ("Roswaal", "君は私になーぁにを望むのかな？");`

## Fetch all data from users table

`SELECT * FROM users;`

## curl commands

Get all users: `curl -X GET http://localhost:3000/api/v1/users`  
Get a user by specified id: `curl -X GET http://localhost:3000/api/v1/users/3`  
Search users: `curl -X GET http://localhost:3000/api/v1/search`

## Create following table

```
CREATE TABLE following (
  id INTEGER NOT NULL PRIMARY KEY,
  following_id INTEGER NOT NULL,
  followed_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  FOREIGN KEY (following_id) references users(id),
  FOREIGN KEY (followed_id) references users(id)
);
```

## Insert sample records into following table

```
INSERT INTO following (following_id, followed_id) values (1,2);
INSERT INTO following (following_id, followed_id) values (1,3);
INSERT INTO following (following_id, followed_id) values (1,4);
INSERT INTO following (following_id, followed_id) values (2,1);
INSERT INTO following (following_id, followed_id) values (2,3);
INSERT INTO following (following_id, followed_id) values (3,4);
INSERT INTO following (following_id, followed_id) values (4,3);
```
