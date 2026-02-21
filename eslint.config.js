import eslintPluginImport from 'eslint-plugin-import-x';
import eslintPluginBoundaries from 'eslint-plugin-boundaries';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    tseslint.configs.recommended,
    {
        files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            import: eslintPluginImport,
            boundaries: eslintPluginBoundaries,
            'react-hooks': eslintPluginReactHooks,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: ['tsconfig.base.json', 'apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
                },
            },
            'boundaries/elements': [
                { type: 'app', pattern: 'apps/*' },
                { type: 'db', pattern: 'packages/db' },
                { type: 'ui', pattern: 'packages/ui' },
                { type: 'ai-engine', pattern: 'packages/ai-engine' },
                { type: 'counseling', pattern: 'packages/counseling' },
                { type: 'analysis', pattern: 'packages/analysis' },
                { type: 'matching', pattern: 'packages/matching' },
                { type: 'report', pattern: 'packages/report' },
                { type: 'shared', pattern: 'packages/shared' }
            ],
        },
        rules: {
            'boundaries/element-types': [
                'error',
                {
                    default: 'allow',
                    message: '${file.type} is not allowed to import from ${dependency.type}',
                    rules: [
                        {
                            from: ['db'],
                            disallow: ['app', 'ui', 'ai-engine', 'counseling', 'analysis', 'matching', 'report'],
                            message: 'Database package MUST NOT depend on higher-level packages or apps',
                        },
                        {
                            from: ['ui'],
                            disallow: ['app', 'db', 'ai-engine', 'counseling', 'analysis', 'matching', 'report'],
                            message: 'UI package MUST NOT depend on backend/domain logic or apps',
                        },
                        {
                            from: ['shared'],
                            disallow: ['app', 'db', 'ui', 'ai-engine', 'counseling', 'analysis', 'matching', 'report'],
                            message: 'Shared package MUST NOT depend on other specific packages to prevent circular dependencies',
                        },
                        {
                            from: ['ai-engine', 'counseling', 'analysis', 'matching', 'report'],
                            disallow: ['app'],
                            message: 'Domain packages MUST NOT depend on upper-level applications',
                        }
                    ]
                }
            ],
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: true,
                    optionalDependencies: false,
                    peerDependencies: false,
                },
            ],
            'import/no-cycle': ['error', { maxDepth: 1 }],
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-require-imports': 'warn'
        }
    }
);
