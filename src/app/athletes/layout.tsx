export default function AthletesLayout({
    children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="container-fluid">
      <h2>Athletes</h2>
      {children}
      </div>
    </section>
  )
}