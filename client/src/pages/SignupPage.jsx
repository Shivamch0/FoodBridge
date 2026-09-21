import { AuthForm } from "../components/AuthForm";
import { AuthLayout } from "../components/AuthLayout";

export function SignupPage({ onSignup, onLogin }) {
  return (
    <AuthLayout
      eyebrow="Join the network"
      title={
        <>
          Make room for
          <br />
          more good.
        </>
      }
      alternate="Already part of FoodBridge? Sign in"
      onAlternate={onLogin}
    >
      <p className="eyebrow">Create account</p>
      <h2 className="mt-3 font-display text-4xl tracking-[-0.05em]">
        Start your bridge.
      </h2>
      <p className="mt-3 text-sm text-[#718080]">
        Choose how you want to help your community.
      </p>
      <AuthForm
        mode="signup"
        onSubmit={onSignup.submit}
        error={onSignup.error}
        loading={onSignup.loading}
      />
    </AuthLayout>
  );
}
