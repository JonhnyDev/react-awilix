import remove from './utils/remove.mjs';

const args = process.argv.slice(2);

const paths = new Set();

const allPaths = ['node_modules'];

const defaultPaths = ['dist', 'cjs', 'esm', 'types', 'coverage'];

if (!args.length) {
  defaultPaths.forEach((p) => {
    paths.add(p);
  });
} else {
  args.forEach((arg) => {
    if (arg === 'all') {
      [...defaultPaths, ...allPaths].forEach((p) => {
        paths.add(p);
      });
    } else {
      paths.add(arg);
    }
  });
}

paths.forEach((p) => {
  remove(p);
});
