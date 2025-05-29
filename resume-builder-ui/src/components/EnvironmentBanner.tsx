export default function EnvironmentBanner() {
  const env = process.env.NODE_ENV || "development";
  const bgColor = env === "production" ? "bg-green-600" : "bg-red-600"; // Customize as desired
  const message =
    env === "production" ? "Production Environment" : "Development Environment";

  return (
    <div className={`${bgColor} text-white text-center py-1 text-sm`}>
      {message}
    </div>
  );
}
