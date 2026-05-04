import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputRoot = path.resolve('.tmp-tests');
const sourceRoot = path.join(outputRoot, 'src');

async function listJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listJavaScriptFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
    }),
  );

  return files.flat();
}

function toRelativeImport(fromFile, aliasPath) {
  const targetPath = path.join(sourceRoot, aliasPath.slice(2));
  let relativePath = path.relative(path.dirname(fromFile), targetPath).replaceAll(path.sep, '/');

  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

async function rewriteFile(filePath) {
  const original = await readFile(filePath, 'utf8');
  const rewritten = original.replace(
    /((?:require\(|from\s+|import\()\s*["'])(@\/[^"']+)(["'])/g,
    (_match, prefix, aliasPath, suffix) => `${prefix}${toRelativeImport(filePath, aliasPath)}${suffix}`,
  );

  if (rewritten !== original) {
    await writeFile(filePath, rewritten);
  }
}

try {
  const outputStats = await stat(outputRoot);

  if (!outputStats.isDirectory()) {
    throw new Error(`${outputRoot} is not a directory`);
  }

  const files = await listJavaScriptFiles(outputRoot);
  await Promise.all(files.map(rewriteFile));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
