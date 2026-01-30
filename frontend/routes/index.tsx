import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import HomePage from '../pages/HomePage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ChatPage from '../pages/ChatPage';
import ChatListPage from '../pages/ChatListPage';
import ProfilePage from '../pages/ProfilePage';
import AIMatchPage from '../pages/AIMatchPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CreateProjectPage from '../pages/CreateProjectPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

/**
 * Centrální routing konfigurace
 * 
 * Struktura URL:
 * - / - HomePage (public)
 * - /projects/:id - ProjectDetailPage (public)
 * - /projects/new - CreateProjectPage (protected)
 * - /ai-match - AIMatchPage (protected)
 * - /chat - ChatListPage (protected)
 * - /chat/:id - ChatPage (protected)
 * - /profile - ProfilePage (protected)
 * - /login - LoginPage (public)
 * - /register - RegisterPage (public)
 */
export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes with layout */}
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />

                {/* Protected routes */}
                <Route
                    path="/projects/new"
                    element={
                        <ProtectedRoute>
                            <CreateProjectPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ai-match"
                    element={
                        <ProtectedRoute>
                            <AIMatchPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat/:id"
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Auth routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* 404 - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
