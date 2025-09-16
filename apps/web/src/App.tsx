import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import TutorSearch from './components/TutorSearch';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/login" element={<AuthForm type="login" />} />
      <Route path="/register" element={<AuthForm type="register" />} />
      <Route path="/search" element={
        <Layout>
          <TutorSearch />
        </Layout>
      } />
      <Route path="/tutors" element={
        <Layout>
          <TutorSearch />
        </Layout>
      } />
      <Route path="/dashboard" element={
        <Layout>
          <Dashboard />
        </Layout>
      } />
      <Route path="/bookings" element={
        <Layout>
          <Dashboard />
        </Layout>
      } />
    </Routes>
  );
}


