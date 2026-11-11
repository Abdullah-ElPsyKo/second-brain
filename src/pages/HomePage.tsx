import React from 'react';
import { Sidebar } from '../components/Sidebar';

export function HomePage () {
  return (
    <div style={{display:'flex'}}>
      <main style={{flexGrow:1, padding:'1rem'}}>
        <h1>Welcome</h1>
        <p>This is the main content area.</p>
      </main>
    </div>
  );
};