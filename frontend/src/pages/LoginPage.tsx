import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/errors";
import { ErrorAlert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      showToast("Uspešno si prijavljen/a.", "success");
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom prijave. Pokušaj ponovo."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="page page--narrow fade-in"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <div className="card">
        <h1 style={{ textAlign: "center" }}>✈ Trip Planner</h1>
        <p style={{ textAlign: "center", marginBottom: 24 }}>Prijavi se na svoj nalog</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Lozinka</label>
            <input
              id="password"
              type="password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <ErrorAlert message={error} />}

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </div>
    </div>
  );
}
