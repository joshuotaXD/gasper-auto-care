/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactiva la generación estática estricta que causa el error de useState
  output: 'standalone',
};

module.exports = nextConfig;