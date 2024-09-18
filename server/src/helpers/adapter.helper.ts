import { existsSync } from 'fs';
import { join } from 'path';

export async function loadImplementation<T>(
  baseModulePath: string,
  overrideModulePath: string,
): Promise<T> {
  let baseModule: T;
  let overrideModule: Partial<T> = {}; // override module may only implement some methods

  // Load base module
  try {
    const base = await import(baseModulePath);
    baseModule = base.default || base;
  } catch (error) {
    throw new Error(
      `Failed to load base module: ${baseModulePath}. Error: ${error}`,
    );
  }

  // Check if override module exists and load if available
  if (existsSync(overrideModulePath)) {
    try {
      const override = await import(overrideModulePath);
      overrideModule = override.default || override;
    } catch (error) {
      console.log(
        `EE module not found. Falling back to base module: ${error.message}`,
      );
    }
  }

  // Merge override methods into the base module (fallback to base for unimplemented methods)
  return {
    ...baseModule,
    ...overrideModule,
  };
}
