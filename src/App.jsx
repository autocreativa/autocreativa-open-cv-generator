import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Import from './pages/Import';
import SelectTemplate from './pages/SelectTemplate';
import CreateCV from './pages/CreateCV';
import Editor from './pages/Editor';
import './index.css';

function App() {
  return (
    <CVProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/importar" element={<Import />} />
            <Route path="/seleccionar-plantilla" element={<SelectTemplate />} />
            <Route path="/plantillas" element={<SelectTemplate />} />

            {/* Core Features */}
            <Route path="/crear" element={<CreateCV />} />
            <Route path="/editor" element={<Editor />} />

            <Route path="/como-funciona" element={<ComingSoon title="Cómo Funciona" />} />

            {/* Legal Pages */}
            <Route path="/terminos" element={<ComingSoon title="Términos y Condiciones" />} />
            <Route path="/privacidad" element={<ComingSoon title="Política de Privacidad" />} />
            <Route path="/sobre-nosotros" element={<ComingSoon title="Sobre Nosotros" />} />
            <Route path="/contacto" element={<ComingSoon title="Contacto" />} />
            <Route path="/faq" element={<ComingSoon title="Preguntas Frecuentes" />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </CVProvider>
  );
}

// Placeholder component for coming soon pages
const ComingSoon = ({ title }) => (
  <main style={{
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    marginTop: '72px',
    textAlign: 'center',
  }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
      {title}
    </h1>
    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
      Esta página estará disponible próximamente.
    </p>
    <a
      href="/"
      style={{
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        background: 'var(--primary-500)',
        color: 'white',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontWeight: '600',
      }}
    >
      Volver al inicio
    </a>
  </main>
);

// 404 Page
const NotFound = () => (
  <main style={{
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    marginTop: '72px',
    textAlign: 'center',
  }}>
    <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: 'var(--primary-500)', marginBottom: '0' }}>
      404
    </h1>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
      Página no encontrada
    </h2>
    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
      La página que buscas no existe o ha sido movida.
    </p>
    <a
      href="/"
      style={{
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        background: 'var(--primary-500)',
        color: 'white',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontWeight: '600',
      }}
    >
      Volver al inicio
    </a>
  </main>
);

export default App;
