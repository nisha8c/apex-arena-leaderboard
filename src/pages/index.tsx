import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Layout from "./Layout";
import Leaderboard from "./Leaderboard";
import Players from "./Players";
import Admin from "./Admin";
import Login from "./Login";

const PAGES = {
    Leaderboard,
    Players,
    Admin,
    Login,
};

function getCurrentPage(url: string): keyof typeof PAGES {
    let cleanUrl = url;
    if (cleanUrl.endsWith("/")) {
        cleanUrl = cleanUrl.slice(0, -1);
    }
    let urlLastPart = cleanUrl.split("/").pop() || "";
    if (urlLastPart.includes("?")) {
        urlLastPart = urlLastPart.split("?")[0];
    }
    const pageName = (Object.keys(PAGES) as (keyof typeof PAGES)[]).find(
        (page) => page.toLowerCase() === urlLastPart.toLowerCase()
    );
    return pageName || "Leaderboard";
}

// Wrapper so we can call useLocation inside Router
function PagesContent() {
    const location = useLocation();
    const currentPage = getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Leaderboard />} />
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/Players" element={<Players />} />
                <Route path="/Admin" element={<Admin />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
