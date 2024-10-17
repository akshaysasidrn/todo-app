import React, { Suspense, useState, useEffect } from 'react';

interface WithEditionLoaderProps {
  loadDir: string;
  fileName: string;
}

export async function loadComponent<T>(
  loadDir: string,
  fileName: string,
): Promise<React.ComponentType<T>> {
  const ALLOWED_EDITIONS = ['ce', 'ee'];
  const edition = process.env.REACT_APP_EDITION || 'ce';
  if (!ALLOWED_EDITIONS.includes(edition)) {
    throw new Error(
      `Unrecognized edition: ${edition}. Allowed editions are: ${ALLOWED_EDITIONS.join(', ')}`,
    );
  }
  let module;
  switch (edition) {
    case 'ee':
      module = await import(`@ee/components/${loadDir}/${fileName}.ee`);
      break;
    case 'ce':
    default:
      module = await import(`@ce/components/${loadDir}/${fileName}.ce`);
      break;
  }
  return module.default;
}

function withEditionLoader<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  { loadDir, fileName }: WithEditionLoaderProps
) {
  return function WithEditionLoader(props: T) {
    const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);

    useEffect(() => {
      let isMounted = true;
      loadComponent<T>(loadDir, fileName).then((LoadedComponent) => {
        if (isMounted) {
          setComponent(() => LoadedComponent);
        }
      });
      return () => {
        isMounted = false;
      };
    }, []);

    if (!Component) {
      return <div>Loading...</div>;
    }

    return (
      <Suspense fallback={<div>Loading component...</div>}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export default withEditionLoader;
