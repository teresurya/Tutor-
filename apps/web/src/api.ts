export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
		...options,
	});
	if (!res.ok) {
		throw new Error(`API ${res.status}`);
	}
	return res.json() as Promise<T>;
}
