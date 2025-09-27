import { useState } from "react";

import { supabase } from "../lib/supabaseClient";

type Mode = "login" | "signup";

interface Props {
  onAuthenticated?: () => void;
}

// NOTE: This component assumes existence of the following tables:
//  companies: { id (uuid) PK, name text UNIQUE }
//  employees: { id uuid PK default gen_random_uuid(), user_id uuid FK auth.users.id, company_id uuid FK companies.id }
// Adjust SQL to your project if needed. Minimal suggested SQL:
//  create table companies ( id uuid primary key default gen_random_uuid(), name text unique not null );
//  create table employees ( id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, company_id uuid references companies(id) on delete cascade );
//  create index on employees(user_id);
//  create index on employees(company_id);

export const Login = ({ onAuthenticated }: Props) => {
  const [mode, setMode] = useState<Mode>("login");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setMessage(null);
  };

  const handleSignup = async () => {
    if (!supabase) {
      setError("Supabase not configured");
      return;
    }
    resetMessages();
    if (!company.trim() || !email.trim() || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      // 1. Ensure company exists (create if not)
      const companyName = company.trim();
      const { data: existingCompany, error: companyFetchError } = await supabase
        .from("companies")
        .select("id")
        .eq("name", companyName)
        .maybeSingle();
      if (companyFetchError) {
        throw companyFetchError;
      }

      let companyId = existingCompany?.id as string | undefined;
      if (!companyId) {
        const { data: inserted, error: insertCompanyError } = await supabase
          .from("companies")
          .insert({ name: companyName })
          .select("id")
          .single();
        if (insertCompanyError) {
          throw insertCompanyError;
        }
        companyId = inserted.id;
      }

      // 2. Sign up user
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
      if (signUpError) {
        throw signUpError;
      }

      const user = signUpData.user;
      if (!user) {
        setMessage(
          "Sign up initiated. Check your email to confirm before logging in.",
        );
        return;
      }

      // 3. Insert employee record (idempotent-ish: ignore duplicate)
      const { error: employeeInsertError } = await supabase
        .from("employees")
        .insert({ user_id: user.id, company_id: companyId });
      if (employeeInsertError && employeeInsertError.code !== "23505") {
        // 23505 conflict (unique violation) if you add a unique constraint later
        throw employeeInsertError;
      }

      setMessage(
        user.email_confirmed_at
          ? "Account created and linked to company. You are logged in."
          : "Account created. Please confirm your email before continuing.",
      );
      onAuthenticated?.();
    } catch (e: any) {
      setError(e.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!supabase) {
      setError("Supabase not configured");
      return;
    }
    resetMessages();
    if (!company.trim() || !email.trim() || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      // Sign in first
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      if (signInError) {
        throw signInError;
      }

      const user = signInData.user;
      if (!user) {
        throw new Error("No user returned");
      }

      // Lookup employee + company
      interface EmployeeJoinRow {
        company_id: string;
        companies: { name: string };
      }
      const { data: employeeRows, error: employeeFetchError } = await supabase
        .from("employees")
        .select("company_id, companies!inner(name)")
        .eq("user_id", user.id)
        .limit(1);
      if (employeeFetchError) {
        throw employeeFetchError;
      }
      const employee = (
        employeeRows as unknown as EmployeeJoinRow[] | null
      )?.[0];
      const actualCompanyName: string | undefined = employee?.companies?.name;
      if (!employee || !actualCompanyName) {
        // If no association, sign out for safety
        await supabase.auth.signOut();
        throw new Error("User not linked to any company");
      }
      if (actualCompanyName.toLowerCase() !== company.trim().toLowerCase()) {
        await supabase.auth.signOut();
        throw new Error("Company name does not match your account");
      }
      setMessage("Logged in successfully");
      onAuthenticated?.();
    } catch (e: any) {
      setError(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.heading}>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            <span>Company Name</span>
            <input
              style={styles.input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme"
              required
            />
          </label>
          <label style={styles.label}>
            <span>Email</span>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label style={styles.label}>
            <span>Password</span>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
        <div style={styles.switchMode}>
          {mode === "login" ? (
            <>
              <span>Need an account?</span>{" "}
              <button style={styles.linkBtn} onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>{" "}
              <button style={styles.linkBtn} onClick={() => setMode("login")}>
                Login
              </button>
            </>
          )}
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.message}>{message}</div>}
        {!supabase && (
          <div style={styles.error}>
            Supabase client not initialized. Add VITE_SUPABASE_URL &
            VITE_SUPABASE_ANON_KEY.
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    background: "#1e1e1e",
    color: "#fff",
    fontFamily: "system-ui, sans-serif",
    padding: 16,
    boxSizing: "border-box",
  },
  panel: {
    width: "100%",
    maxWidth: 380,
    background: "#2a2a2a",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  heading: { margin: "0 0 16px", fontSize: 24, fontWeight: 600 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #444",
    background: "#1b1b1b",
    color: "#fff",
    fontSize: 14,
  },
  button: {
    marginTop: 4,
    background: "#6366f1",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
  },
  switchMode: {
    marginTop: 18,
    fontSize: 13,
    textAlign: "center",
  },
  linkBtn: {
    background: "none",
    color: "#a5b4fc",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    textDecoration: "underline",
  },
  error: {
    marginTop: 16,
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 13,
  },
  message: {
    marginTop: 16,
    background: "#064e3b",
    color: "#a7f3d0",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 13,
  },
};

export default Login;
