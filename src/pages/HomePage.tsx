import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { CaptureList } from '../components/CaptureList';

export function HomePage () {
  return (
    <div style={{display:'flex'}}>
      <main style={{flexGrow:1, padding:'1rem'}}>
        <h1>Welcome to your brain</h1>
        <CaptureList />
      </main>
    </div>
  );
};