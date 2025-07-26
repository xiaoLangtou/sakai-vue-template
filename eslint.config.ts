/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-03-12 10:43:31
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-04-09 11:41:26
 * @FilePath: eslint.config.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import autoImport from './.eslintrc-auto-import.js';

export default typescriptEslint.config(
    {
        ignores: [
            '*.d.ts',
            '**/dist/*',
            '**/plop/*',
            '*.env',
            '*.env.local',
            '.vscode',
            '.idea',
            '.DS_Store',
            'src/types/*.d.ts',
        ],
    },

    {
        extends: [
            eslint.configs.recommended,
            ...typescriptEslint.configs.recommended,
            ...eslintPluginVue.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,vue,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...autoImport.globals,
            },
            parserOptions: {
                parser: typescriptEslint.parser,
                jsx: true,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'max-params': ['error', 4],
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/unified-signatures': 'off',
            'vue/no-duplicate-attr-inheritance': 'off',
            'vue/no-ref-object-reactivity-loss': 1,
            'vue/multi-word-component-names': 'off',
            'vue/block-order': [
                'error',
                {
                    order: [['template', 'script'], 'style'],
                },
            ],

            'vue/no-duplicate-attributes': [
                'error',
                {
                    allowCoexistClass: true,
                    allowCoexistStyle: true,
                },
            ],
            'no-irregular-whitespace': [
                1,
                {
                    skipComments: true,
                },
            ],
            'object-curly-spacing': ['error', 'always'],
            'vue/max-attributes-per-line': ['error', {
                singleline: 1, // 单行最多1个属性
                multiline: 1   // 多行每行1个属性
            }],
        },
    },
    eslintConfigPrettier,
);
