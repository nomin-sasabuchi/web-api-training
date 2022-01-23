const indexModule = (() => {
	const path = window.location.pathname;

	switch (path) {
		case "/":
			//検索ボタンをクリックした時のイベントリスナー設定
			document.getElementById("search-btn").addEventListener("click", () => {
				return searchModule.searchUsers();
			});
			//UsersモジュールのfeatchAllUsersメソッドを呼び出す
			return usersModule.fetchAllUsers();
		case "/create.html":
			document
				.getElementById("save-btn")
				.addEventListener("click", () => usersModule.createUser());
			document
				.getElementById("cansel-btn")
				.addEventListener("click", () => (window.location.href = "/"));
		case "/edit.html":
			const uid = window.location.search.split("?uid=")[1];
			console.log("uid", uid);
			document
				.getElementById("save-btn")
				.addEventListener("click", () => usersModule.updateUser(uid));
			document
				.getElementById("cansel-btn")
				.addEventListener("click", () => (window.location.href = "/"));
			document
				.getElementById("delete-btn")
				.addEventListener("click", () => usersModule.deleteUser(uid));

			return usersModule.setExistingValue(uid);
		default:
			break;
	}
})();
