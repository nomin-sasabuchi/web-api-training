const searchModule = (() => {
	const BASE_URL = "http://localhost:3000/api/v1/search";

	return {
		searchUsers: async () => {
			//検索窓への入力値を取得
			const query = document.getElementById("search").value;

			const res = await fetch(`${BASE_URL}?q=${query}`);
			const result = await res.json();
			let body = "";
			for (let index = 0; index < result.length; index++) {
				const user = result[index];
				body += `<tr>
				<td>${user.id}</td>
				<td>${user.name}</td>
				<td>${user.profile}</td>
				<td>${user.date_of_birth}</td>
				<td>${user.created_at}</td>
				<td>${user.update_at}</td>
      </tr>`;
				å;
				document.getElementById("users-list").innerHTML = body;
			}
		},
	};
})();
