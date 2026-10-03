export function BrandMark({ large = false }: { large?: boolean }) {
  return <span aria-hidden="true" className={large ? "hc-brand-mark hc-brand-mark-large" : "hc-brand-mark"} />;
}
