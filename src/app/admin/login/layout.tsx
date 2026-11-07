/**
 * Layout exclusivo para login — sin sidebar ni topbar.
 * Sobreescribe el layout de /admin para esta ruta.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {children}
    </div>
  )
}
