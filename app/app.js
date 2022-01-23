const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const dbpath = "app/db/database.sqlite3";
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));

//リクエストのbodyをパースする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app(express)getメソッドを投げた際に実行する関数
app.get("/api/v1/users", (req, res) => {
	const db = new sqlite3.Database(dbpath);
	db.all("SELECT * FROM users", (err, rows) => {
		res.json(rows);
	});
	db.close();
});

app.get("/api/v1/users/:id", (req, res) => {
	const db = new sqlite3.Database(dbpath);
	const id = req.params.id;
	db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
		if (!row) {
			res.status(404).send({ error: "Not Found!" });
		} else {
			res.status(200).json(row);
		}
	});
	db.close();
});

app.get("/api/v1/search", (req, res) => {
	const db = new sqlite3.Database(dbpath);
	const keyword = req.query.q;
	db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
		res.json(rows);
	});
	db.close();
});

const run = async (sql, db) => {
	return new Promise((resolve, reject) => {
		db.run(sql, (err) => {
			if (err) {
				return reject(err);
			} else {
				res.json({ message: message });
				return resolve();
			}
		});
	});
};

//追加
app.post("/api/v1/users", async (req, res) => {
	if (!req.body.name || req.body.name === "") {
		res.status(400).send({ error: "ユーザ名が指定されていません" });
	} else {
		const db = new sqlite3.Database(dbpath);

		const name = req.body.name;
		const profile = req.body.profile ? req.body.profile : "";
		const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";

		try {
			await run(
				`INSERT INTO users (name,profile,date_of_birth) VALUES ("${name}","${profile}","${dateOfBirth}")`,
				db
			);
			res.status(201).send({ message: "新規ユーザーを作成しました" });
		} catch (e) {
			res.status(500).send({ error: e });
		}

		db.close();
	}
});

//更新
app.put("/api/v1/users/:id", async (req, res) => {
	if (!req.body.name || req.body.name === "") {
		res.status(400).send({ error: "ユーザ名が指定されていません" });
	} else {
		const db = new sqlite3.Database(dbpath);
		const id = req.params.id;

		//現在のユーザー情報を取得する
		db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
			if (!row) {
				res
					.status(404)
					.send({ error: "指定されたユーザーが見つかりませんでした" });
			} else {
				const name = req.body.name ? req.body.name : row.name;
				const profile = req.body.profile ? req.body.profile : row.profile;
				const dateOfBirth = req.body.date_of_birth
					? req.body.date_of_birth
					: row.date_of_birth;

				try {
					await run(
						`UPDATE users SET name="${name}",profile="${profile}",date_of_birth="${dateOfBirth}" WHERE id=${id}`,
						db
					);
					res.status(200).send({ message: "ユーザー情報を更新しました" });
				} catch (e) {
					res.status(500).send({ error: e });
				}
			}
		});
		db.close();
	}
});

//削除
app.delete("/api/v1/users/:id", async (req, res) => {
	const db = new sqlite3.Database(dbpath);
	const id = req.params.id;
	db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
		if (!row) {
			res
				.status(404)
				.send({ error: "指定されたユーザーが見つかりませんでした" });
		} else {
			try {
				//現在のユーザー情報を取得する
				await run(
					`DELETE FROM users WHERE id=${id}`,
					db,
					res,
					"ユーザー情報を削除しました"
				);
				res.status(200).send({ message: "ユーザー情報を削除しました" });
			} catch (e) {
				res.status(500).send({ error: e });
			}
		}

		db.close();
	});
});

const port = process.env.PORT || 3000;

//指定されたホストとポートで接続をバインドしてリッスン
app.listen(port);

console.log("listen on port" + port);
