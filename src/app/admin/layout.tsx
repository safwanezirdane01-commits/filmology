/**
 * Admin layout — bypasses the global `<main max-w-7xl ...>` wrapper
 * so the sidebar + full-screen dashboard can render edge-to-edge.
 * The global Navbar is also hidden here; the admin has its own header.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Override the flex-col body flow: fill the rest of the viewport
    <div className="flex-1 w-full overflow-hidden">
      {children}
    </div>
  );
}
