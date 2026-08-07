import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { ConfirmDialogHost } from "./components/confirm-dialog-host";
import { LoadingOverlayHost } from "./components/loading-overlay-host";
import { Toaster } from "./components/ui/sonner";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '16px',
      fontFamily: 'system-ui, sans-serif',
      background: '#f9fafb',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #B0008E',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Cargando...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Outlet />
      <ConfirmDialogHost />
      <LoadingOverlayHost />
      <Toaster richColors closeButton />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Algo salió mal";
  let details = "Ocurrió un error inesperado. Por favor recarga la página.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Página no encontrada" : "Error";
    details =
      error.status === 404
        ? "La página que buscas no existe."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '12px',
      fontFamily: 'system-ui, sans-serif',
      background: '#f9fafb',
    }}>
      <p style={{ fontSize: '32px', margin: 0 }}>⚠️</p>
      <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#111827' }}>{message}</h1>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '320px' }}>{details}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '8px',
          padding: '8px 20px',
          background: '#B0008E',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        Recargar página
      </button>
    </div>
  );
}
