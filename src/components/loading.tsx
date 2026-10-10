export function ProductSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="পণ্য লোড হচ্ছে" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <span />
          <div>
            <i />
            <i />
          </div>
          <i className="skeleton-price" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  href = "/",
  action = "হোম পেজে ফিরে যান",
}: {
  title: string;
  message: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty-state">
      <span>🧺</span>
      <h2>{title}</h2>
      <p>{message}</p>
      <a className="button" href={href}>
        {action}
      </a>
    </div>
  );
}
