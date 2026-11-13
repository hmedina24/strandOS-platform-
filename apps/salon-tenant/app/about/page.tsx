import { ConfigurationError } from "../../components/configuration-error";
import { PublicShell } from "../../components/public-shell";
import { loadTenantRuntime } from "../../lib/tenant-runtime";

export default function AboutPage() {
  const result = loadTenantRuntime();
  if (!result.ok) {
    return (
      <ConfigurationError errors={result.errors} />
    );
  }
  const { about } = result.runtime;
  return (
    <PublicShell runtime={result.runtime}>
      <main className="page public-page">
        <section className="about-hero">
          <p className="eyebrow">{about.eyebrow}</p>
          <h1>{about.title}</h1>
          <p>{about.summary}</p>
        </section>
        <section className="about-sections" aria-label="Our story">
          {about.sections.map((section, index) => (
            <article key={section.title}>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
