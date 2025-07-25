export default function EnvironmentBanner() {
  const env = import.meta.env.MODE;
  if (env === "production") return null;

  return (
    <div className="bg-red-600 text-white text-center py-1 text-sm">
      Development Environment
    </div>
  );
}
