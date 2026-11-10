export function ConfigurationError({ errors }: { errors: string[] }) {
  return (
    <main className="configuration-error">
      <p className="eyebrow">Tenant configuration needs attention</p>
      <h1>This salon application cannot start yet.</h1>
      <p>StrandOS must correct the approved configuration before this runtime can render.</p>
      <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
    </main>
  );
}
