import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthAdapter = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle?: () => Promise<void>;
};

function getAdapter(): AuthAdapter | null {
  try {
    const anyWin = window as any;
    return anyWin.__STUDAI_AUTH_ADAPTER__ ?? null;
  } catch {
    return null;
  }
}

export function AuthCard() {
  const [tab, setTab] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const minPasswordOk = password.length >= 6;
  const passwordsMatch = confirmPassword === password;

  async function handleLogin() {
    if (!email || !password) {
      alert("Preencha email e senha");
      return;
    }
    setBusy(true);
    try {
      const adapter = getAdapter();
      if (!adapter) {
        alert("Sistema de autenticação não configurado");
        return;
      }
      await adapter.signIn(email.trim(), password);
      alert("Login realizado com sucesso!");
    } catch {
      alert("Erro ao fazer login");
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      alert("Preencha todos os campos");
      return;
    }
    if (!minPasswordOk) {
      alert("Senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (!passwordsMatch) {
      alert("As senhas não coincidem");
      return;
    }
    setBusy(true);
    try {
      const adapter = getAdapter();
      if (!adapter) {
        alert("Sistema de autenticação não configurado");
        return;
      }
      await adapter.signUp(email.trim(), password);
      alert("Conta criada! Verifique seu email.");
      setTab("login");
    } catch {
      alert("Erro ao criar conta");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setBusy(true);
    try {
      const adapter = getAdapter();
      if (!adapter?.signInWithGoogle) {
        alert("Login com Google não disponível");
        return;
      }
      await adapter.signInWithGoogle();
    } catch {
      alert("Erro ao fazer login com Google");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl">
      {/* Tabs */}
      <div className="grid grid-cols-2 bg-gray-100 p-1.5 gap-1.5 mb-8 rounded-2xl">
        <button
          onClick={() => setTab("login")}
          className={`py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
            tab === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setTab("register")}
          className={`py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
            tab === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Create account
        </button>
      </div>

      {/* Content */}
      <div>
        {tab === "login" ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome back
              </h3>
              <p className="text-sm text-gray-600">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              disabled={busy}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-900 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4A9FFF] focus:ring-[#4A9FFF]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Label htmlFor="login-password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4A9FFF] focus:ring-[#4A9FFF] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleLogin}
              disabled={busy}
              className="w-full h-12 bg-[#4A9FFF] text-white font-semibold rounded-xl shadow-lg shadow-[#4A9FFF]/20 hover:shadow-xl hover:shadow-[#4A9FFF]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Create your account
              </h3>
              <p className="text-sm text-gray-600">
                Takes just a few minutes. Confirm via email.
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              disabled={busy}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-900 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4A9FFF] focus:ring-[#4A9FFF]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4A9FFF] focus:ring-[#4A9FFF] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className={`text-xs font-medium ${minPasswordOk ? "text-green-500" : "text-gray-400"}`}>
                At least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                Confirm password
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4A9FFF] focus:ring-[#4A9FFF]"
              />
              {confirmPassword && (
                <p className={`text-xs font-medium ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
                  {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              onClick={handleRegister}
              disabled={busy}
              className="w-full h-12 bg-[#4A9FFF] text-white font-semibold rounded-xl shadow-lg shadow-[#4A9FFF]/20 hover:shadow-xl hover:shadow-[#4A9FFF]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "Creating account..." : "Create account"}
            </Button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating your account, you agree to the{" "}
              <a href="/termos" className="text-[#4A9FFF] hover:text-gray-900 font-semibold underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacidade" className="text-[#4A9FFF] hover:text-gray-900 font-semibold underline">
                Privacy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


