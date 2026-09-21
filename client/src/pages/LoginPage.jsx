import { AuthForm } from "../components/AuthForm";
import { AuthLayout } from "../components/AuthLayout";

export function LoginPage({ onLogin, onSignup }) {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title={
        <>
          Keep the good
          <br />
          things moving.
        </>
      }
      alternate="New to FoodBridge? Create an account"
      onAlternate={onSignup}
    >
      <p className="eyebrow">Sign in</p>
      <h2 className="mt-3 font-display text-4xl tracking-[-0.05em]">
        Welcome back.
      </h2>
      <p className="mt-3 text-sm text-[#718080]">
        Pick up where your impact left off.
      </p>
      <AuthForm
        mode="login"
        onSubmit={onLogin.submit}
        error={onLogin.error}
        loading={onLogin.loading}
      />
    </AuthLayout>
  );
}
