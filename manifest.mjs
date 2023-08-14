export default {
  manifest_version: 2,
  background: {
    scripts: ["js/background.js"],
  },
  browser_action: {
    default_popup: "index.html",
  },
  permissions: ["tabs"],
};
