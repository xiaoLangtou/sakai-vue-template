import { z } from 'zod';

/**
 * Zod resolver for PrimeVue Forms
 * @param schema - Zod schema for validation
 * @returns Resolver function for PrimeVue Forms
 */
export function zodResolver(schema: z.ZodSchema) {
  return (values: any) => {
    try {
      schema.parse(values);
      return { valid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        return { valid: false, errors };
      }
      return { valid: false, errors: { _form: 'Validation failed' } };
    }
  };
}

export type { z };