
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: router for CapyTalk client
 */

import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export function Router() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/users/login" element={<LoginPage />} />
                <Route path="/users/signup" element={<SignupPage />} />
                <Route path="/dashboard/:userId" element={<Dashboard />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Route>
        )
    )
    return router;
}