import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['spec/**/*Spec.js'],
    globals: true,
  },
});
