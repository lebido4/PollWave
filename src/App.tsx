import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import CreatePoll from "./pages/CreatePoll/CreatePoll";
import PollDetails from "./pages/PollDetails/PollDetails";
import VotePage from "./pages/VotePage/VotePage";
import Results from "./pages/Results/Results";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Polls from "./pages/Polls/Polls";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="polls" element={<Polls />} />
        <Route path="poll/:id" element={<PollDetails />} />
        <Route
          path="vote/:id"
          element={
            <ProtectedRoute>
              <VotePage />
            </ProtectedRoute>
          }
        />
        <Route path="results/:id" element={<Results />} />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="create"
          element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
