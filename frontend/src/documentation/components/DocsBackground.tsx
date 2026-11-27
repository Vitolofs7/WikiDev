export function DocsBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-(--bg)"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(54rem 28rem at 50% -14%, rgba(56, 178, 192, 0.06), transparent 70%)",
        }}
      />
    </div>
  );
}
