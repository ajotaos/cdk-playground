import { join } from 'node:path';

export const backendPathOf =
  (service: string) =>
  (...components: string[]) =>
    join('backend', service, ...components);
