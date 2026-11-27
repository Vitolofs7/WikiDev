export default function HomeBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-(--bg)"
      aria-hidden="true"
    >
      {/* Restrained ambient slate light from upper-right behind the code workbench */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(56rem 34rem at 76% 6%, rgba(56, 178, 192, 0.08), transparent 68%)",
        }}
      />
    </div>
  );
}
