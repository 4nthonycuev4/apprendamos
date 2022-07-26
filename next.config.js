const removeImports = require("next-remove-imports")();

nextConfig = removeImports({
    reactStrictMode: true,
    swcMinify: true,
});

module.exports = nextConfig;
