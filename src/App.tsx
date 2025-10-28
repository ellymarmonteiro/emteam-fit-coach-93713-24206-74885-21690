import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Gender from "./pages/onboarding/Gender";
import Assessment from "./pages/onboarding/Assessment";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Measurements from "./pages/Measurements";
import Referrals from "./pages/Referrals";
import Profile from "./pages/Profile";
import Exams from "./pages/Exams";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Evaluation from "./pages/Evaluation";
import Notifications from "./pages/Notifications";
import CoachAuth from "./pages/coach/CoachAuth";
import CoachDashboard from "./pages/coach/CoachDashboard";
import CoachStudents from "./pages/coach/CoachStudents";
import CoachStudentProfile from "./pages/coach/CoachStudentProfile";
import CoachStudentEdit from "./pages/coach/CoachStudentEdit";
import CoachPendingPlans from "./pages/coach/CoachPendingPlans";
import CoachAITraining from "./pages/coach/CoachAITraining";
import CoachProgress from "./pages/coach/CoachProgress";
import CoachSettings from "./pages/coach/CoachSettings";
import CoachReferrals from "./pages/coach/CoachReferrals";
import CoachRanking from "./pages/coach/CoachRanking";
import NotFound from "./pages/NotFound";

import CoachExercises from "./pages/coach/CoachExercises";

import ChatWithCoach from "./pages/ChatWithCoach";

const queryClient = new QueryClient();

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MAINTENANCE } from "./config";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check admin role via user_roles query
        try {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);
          setIsAdmin(!!roles?.some(r => r.role === 'admin'));
        } catch (_) {
          setIsAdmin(false);
        }
      }
    };
    init();
  }, []);

  if (MAINTENANCE && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-primary font-bold">EM</span>
          </div>
          <h1 className="text-3xl font-bold">Em manutenção — correções em andamento</h1>
          <p className="text-muted-foreground">Apenas administradores autenticados podem acessar temporariamente.</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding/gender" element={<Gender />} />
              <Route path="/onboarding/assessment" element={<Assessment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatWithCoach />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/subscription-success" element={<SubscriptionSuccess />} />
              <Route path="/coach/auth" element={<CoachAuth />} />
              <Route path="/coach/dashboard" element={<CoachDashboard />} />
              <Route path="/coach/students" element={<CoachStudents />} />
              <Route path="/coach/student/:id" element={<CoachStudentProfile />} />
              <Route path="/coach/student/:id/edit" element={<CoachStudentEdit />} />
              <Route path="/coach/pending-plans" element={<CoachPendingPlans />} />
              <Route path="/coach/ai-training" element={<CoachAITraining />} />
              <Route path="/coach/progress" element={<CoachProgress />} />
              <Route path="/coach/referrals" element={<CoachReferrals />} />
              <Route path="/coach/ranking" element={<CoachRanking />} />
              <Route path="/coach/settings" element={<CoachSettings />} />
              <Route path="/coach/exercises" element={<CoachExercises />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
