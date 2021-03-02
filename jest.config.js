const projects = [
  {
    displayName: 'React Test',
    testRegex: '.*\\.spec\\.tsx$',
    setupFilesAfterEnv: ['<rootDir>/tests/utils/setupEnzyme.ts'],
    moduleNameMapper: {
      '^@jishida/react-awilix$': '<rootDir>/src',
    },
  },
  {
    displayName: 'Preact Test',
    testRegex: '.*\\.spec\\.tsx$',
    setupFilesAfterEnv: ['<rootDir>/tests/utils/setupEnzyme.ts'],
    moduleNameMapper: {
      '^@jishida/react-awilix$': '<rootDir>/src',
      '^react$': 'preact/compat',
      '^enzyme-adapter-react-16$': 'enzyme-adapter-preact-pure',
    },
  },
];

if (process.env.TEST_MODE === 'all') {
  projects.push(
    {
      displayName: 'React Test (Module)',
      testRegex: '.*\\.spec\\.tsx$',
      setupFilesAfterEnv: ['<rootDir>/tests/utils/setupEnzyme.ts'],
      moduleNameMapper: {
        '^@jishida/react-awilix$': '<rootDir>',
      },
    },
    {
      displayName: 'Preact Test (Module)',
      testRegex: '.*\\.spec\\.tsx$',
      setupFilesAfterEnv: ['<rootDir>/tests/utils/setupEnzyme.ts'],
      moduleNameMapper: {
        '^@jishida/react-awilix$': '<rootDir>',
        '^react$': 'preact/compat',
        '^enzyme-adapter-react-16$': 'enzyme-adapter-preact-pure',
      },
    }
  );
}

module.exports = {
  projects: projects.map((project) => ({
    preset: 'ts-jest',
    transform: {
      '\\.browser\\.js$': [
        'babel-jest',
        { plugins: ['@babel/plugin-transform-moldules-commonjs'] },
      ],
    },
    transformIgnorePatterns: [],
    roots: ['<rootDir>/tests'],
    globals: {
      'ts-jest': {
        tsconfig: 'tests/tsconfig.json',
      },
    },
    ...project,
  })),
  collectCoverageFrom: ['**/src/**', '!**/tests/**'],
};
