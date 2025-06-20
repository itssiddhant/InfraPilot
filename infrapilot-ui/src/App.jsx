// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RCAForm from "./pages/RCAForm";
import RCAList from "./components/RCAList";
import LogViewer from "./components/LogViewer";
import SemanticSearch from "./pages/SemanticSearch";
import GraphMemory from "./pages/GraphMemory";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rca" element={<RCAForm />} />
          <Route path="/rca/history" element={<RCAList />} />
          <Route path="/logs" element={<LogViewer />} />
          <Route path="/semantic-search" element={<SemanticSearch />} />
          <Route path="/graph-memory" element={<GraphMemory />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;