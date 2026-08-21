import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TripsListPage } from "./pages/TripsListPage";
import { TripFormPage } from "./pages/TripFormPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { DestinationFormPage } from "./pages/DestinationFormPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/trips" element={<TripsListPage />} />
            <Route path="/trips/new" element={<TripFormPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/trips/:id/edit" element={<TripFormPage />} />
            <Route path="/trips/:tripId/destinations/new" element={<DestinationFormPage />} />
            <Route path="/trips/:tripId/destinations/:destinationId/edit" element={<DestinationFormPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
