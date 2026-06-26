// Postgres DECIMAL llega como string por el driver pg; lo normalizamos a number.
export const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};
