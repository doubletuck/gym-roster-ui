module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
// This ESLint configuration extends the Next.js core web vitals rules and integrates Prettier for code formatting.
// It ensures that the code adheres to both Next.js best practices and Prettier's formatting rules.
