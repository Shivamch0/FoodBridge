export const validateEnvironment = () => {
  const required = ["MONGO_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];
  if (process.env.NODE_ENV === "production") {
    required.push("CLIENT_URL");
    const missing = required.filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
};