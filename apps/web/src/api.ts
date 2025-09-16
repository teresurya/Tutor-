export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
	const token = localStorage.getItem('token');
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...(options?.headers || {})
	};

	const res = await fetch(`${API_BASE}${path}`, {
		headers,
		...options,
	});

	if (!res.ok) {
		const errorText = await res.text();
		let errorMessage = `API Error ${res.status}`;
		try {
			const errorJson = JSON.parse(errorText);
			errorMessage = errorJson.message || errorJson.error || errorMessage;
		} catch {
			errorMessage = errorText || errorMessage;
		}
		throw new Error(errorMessage);
	}

	const contentType = res.headers.get('content-type');
	if (contentType && contentType.includes('application/json')) {
		return res.json() as Promise<T>;
	}
	return res.text() as Promise<T>;
}

// Auth helpers
export const auth = {
	isLoggedIn: () => !!localStorage.getItem('token'),
	logout: () => {
		localStorage.removeItem('token');
		window.location.href = '/';
	},
	getToken: () => localStorage.getItem('token')
};
