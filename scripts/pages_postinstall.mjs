// Pages automatically installs dependencies even when its build command is empty.
// Use the committed browser assets; page generation needs the parent app repo.
if (process.env.CF_PAGES === "1") await import("./build_site.mjs");
