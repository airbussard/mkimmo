// Separates Layout für Login-Seite - KEIN Auth-Check!
// Überschreibt das Admin-Layout um Redirect-Loop zu vermeiden

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-secondary-50">
      {children}
    </div>
  )
}
