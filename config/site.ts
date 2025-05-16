export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Bohubo",
  description: "Bohubo Dashboard",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://bohubo-dashboard.vercel.app",
  links: { github: "https://github.com/vinhnt2002/bohubo-dashboard" },
};
