import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/errors";
import { ErrorAlert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      showToast("Nalog je uspešno kreiran. Dobrodošao/la!", "success");
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom registracije. Pokušaj ponovo."));
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
        <p style={{ textAlign: "center", marginBottom: 24 }}>Kreiraj novi nalog</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Ime</label>
            <input
              id="name"
              type="text"
              className="input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="field-hint">Najmanje 6 karaktera.</div>
          </div>

          {error && <ErrorAlert message={error} />}

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isSubmitting ? "Kreiranje naloga..." : "Registruj se"}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  );
}
