export async function fetchVisitorMessages(userId:number) {
	const response = await fetch(`https://your-fake-api-url.com/api/user/${userId}/visitor/messages`);
	return response.json();
}

export async function fetchMemories(userId:number) {
	const response = await fetch(`https://your-fake-api-url.com/api/user/${userId}/memories`);
	return response.json();
}

export async function fetchDetail(userId:number) {
	const response = await fetch(`https://your-fake-api-url.com/api/user/${userId}`);
	return response.json();
}