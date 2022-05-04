import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from 'pages/AuthPage';
import Main from 'pages/Main';
import MainMonitorPage from 'pages/MainMonitorPage';

export default () => {
  return (
    <Main>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/monitor" element={<MainMonitorPage />} />
      </Routes>
    </Main>
  );
};
