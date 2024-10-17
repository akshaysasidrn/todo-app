import { resolve, extname } from 'path';

// Define the allowed editions and the edition constant
const ALLOWED_EDITIONS = ['ce', 'ee', 'cloud'];
const EDITION = process.env.EDITION || 'ee';

// Validate the edition
if (!ALLOWED_EDITIONS.includes(EDITION)) {
  throw new Error(
    `Unrecognized edition: ${EDITION}. Allowed editions are: ${ALLOWED_EDITIONS.join(', ')}`,
  );
}

export async function loadImplementation<T>(
  loadDir: string,
  implementationFile: string,
  ...constructorArgs: any[]
): Promise<T> {
  const editionAlias = `@${EDITION}`;

  // ex: @ee/src/todo/todo.service.ee
  const importPath =
    editionAlias +
    loadDir.split('/dist')[1] +
    `/${implementationFile}.${EDITION}`;
  const resolvedImportPath = resolveAlias(importPath);

  let ImplementationClass;

  try {
    console.log(
      `Attempting to load ${EDITION} implementation from: ${resolvedImportPath}`,
    );
    const module = await import(resolvedImportPath);
    ImplementationClass = module.default;
  } catch (error) {
    console.warn('Failed to load implementation.', error);
  }

  // Instantiate the implementation with the provided constructor arguments
  const implementationInstance = new ImplementationClass(...constructorArgs);
  return implementationInstance as T;
}

function resolveAlias(path: string): string {
  const aliasMap = {
    '@ce': resolve(__dirname, '../..'),
    '@ee': resolve(__dirname, '../../ee'),
    '@cloud': resolve(__dirname, '../../cloud'),
  };

  // Directly map the alias to the correct directory path
  const resolvedPath = path.replace(`@${EDITION}`, aliasMap[`@${EDITION}`]);

  // Delegate extension handling to a separate function
  return ensureJsExtension(resolvedPath);
}

function ensureJsExtension(filePath: string): string {
  return !extname(filePath) ? `${filePath}.js` : filePath;
}
