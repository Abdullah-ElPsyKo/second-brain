import React from "react";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { CapturePage } from "./pages/CapturePage";
import { InboxPage } from "./pages/InboxPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/capture" element={<CapturePage />} />
          <Route path="/inbox" element={<InboxPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
