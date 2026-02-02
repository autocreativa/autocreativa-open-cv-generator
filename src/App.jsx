import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Landing from './pages/Landing';
import Import from './pages/Import';
import SelectTemplate from './pages/SelectTemplate';
import CreateCV from './pages/CreateCV';
import Editor from './pages/Editor';
import HowItWorksPage from './pages/HowItWorksPage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import './index.css';

function App() {
  return (
    <CVProvider>
      <BrowserRouter basename="/cv-generator">
        <ScrollToTop />
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

            <Route path="/como-funciona" element={<HowItWorksPage />} />

            {/* Legal Pages */}
            <Route path="/terminos" element={<Terms />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/soporte" element={<Support />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </CVProvider>
  );
}


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
    <Link
      to="/"
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
    </Link>
  </main>
);

export default App;
