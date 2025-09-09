import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { api } from './api';

function Home(){
	const [health, setHealth] = useState<string>('...');
	useEffect(() => { (async () => {
		try { const r = await api<{ ok: boolean }>('/health'); setHealth(r.ok ? 'OK' : 'DOWN'); }
		catch { setHealth('DOWN'); }
	})(); }, []);
	return (
		<div style={{ padding: 24 }}>
			<h1>Tutor</h1>
			<p>API: {health}</p>
			<nav style={{ display: 'flex', gap: 12 }}>
				<Link to='/login'>Login</Link>
				<Link to='/register'>Register</Link>
				<Link to='/tutors'>Find Tutors</Link>
				<Link to='/book'>Book</Link>
			</nav>
		</div>
	);
}

function Login(){
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [result, setResult] = useState('');
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const r = await api<{ token: string; user: any }>(`/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
			setResult(`Logged in: ${r.user.email}`);
			localStorage.setItem('token', r.token);
		} catch (err: any) { setResult(err.message || 'Error'); }
	};
	return (
		<form onSubmit={submit} style={{ padding: 24, display: 'grid', gap: 8 }}>
			<h2>Login</h2>
			<input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
			<input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
			<button type='submit'>Login</button>
			<div>{result}</div>
		</form>
	);
}

function Register(){
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'student'|'parent'|'tutor'>('parent');
	const [result, setResult] = useState('');
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const r = await api<any>(`/auth/register`, { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
			setResult(`Registered: ${r.email}`);
		} catch (err: any) { setResult(err.message || 'Error'); }
	};
	return (
		<form onSubmit={submit} style={{ padding: 24, display: 'grid', gap: 8 }}>
			<h2>Register</h2>
			<input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />
			<input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
			<input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
			<select value={role} onChange={e=>setRole(e.target.value as any)}>
				<option value='parent'>Parent</option>
				<option value='student'>Student</option>
				<option value='tutor'>Tutor</option>
			</select>
			<button type='submit'>Register</button>
			<div>{result}</div>
		</form>
	);
}

function Tutors(){
	const [tutors, setTutors] = useState<any[]>([]);
	useEffect(() => { (async () => {
		try { const r = await api<any[]>('/tutors'); setTutors(r); } catch {}
	})(); }, []);
	return (
		<div style={{ padding: 24 }}>
			<h2>Approved Tutors</h2>
			<ul>
				{tutors.map(t => <li key={t.id}>{t.id} - {t.hourlyRate ?? 'N/A'} / hr</li>)}
			</ul>
		</div>
	);
}

function Book(){
	const [studentId, setStudentId] = useState('');
	const [tutorId, setTutorId] = useState('');
	const [subjectId, setSubjectId] = useState('');
	const [mode, setMode] = useState<'online'|'in_person'>('online');
	const [startAt, setStartAt] = useState('');
	const [endAt, setEndAt] = useState('');
	const [result, setResult] = useState('');
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const r = await api<any>(`/bookings`, { method: 'POST', body: JSON.stringify({ studentId, tutorId, subjectId, mode, startAt, endAt }) });
			setResult(`Booked: ${r.id}`);
		} catch (err: any) { setResult(err.message || 'Error'); }
	};
	return (
		<form onSubmit={submit} style={{ padding: 24, display: 'grid', gap: 8 }}>
			<h2>Book</h2>
			<input placeholder='Student ID' value={studentId} onChange={e=>setStudentId(e.target.value)} />
			<input placeholder='Tutor ID' value={tutorId} onChange={e=>setTutorId(e.target.value)} />
			<input placeholder='Subject ID' value={subjectId} onChange={e=>setSubjectId(e.target.value)} />
			<select value={mode} onChange={e=>setMode(e.target.value as any)}>
				<option value='online'>Online</option>
				<option value='in_person'>In-Person</option>
			</select>
			<input placeholder='Start ISO' value={startAt} onChange={e=>setStartAt(e.target.value)} />
			<input placeholder='End ISO' value={endAt} onChange={e=>setEndAt(e.target.value)} />
			<button type='submit'>Create Booking</button>
			<div>{result}</div>
		</form>
	);
}

export default function App(){
	return (
		<Routes>
			<Route path='/' element={<Home/>} />
			<Route path='/login' element={<Login/>} />
			<Route path='/register' element={<Register/>} />
			<Route path='/tutors' element={<Tutors/>} />
			<Route path='/book' element={<Book/>} />
		</Routes>
	);
}


