export default {
  manifest_version: 3,
  background: {
    scripts: ["background.js"],
    persistent: false,
  },
  permissions: ["tabs"]
};
