import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que hace scroll al inicio de la página cuando cambia la ruta
 * También maneja el foco para accesibilidad
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Hacer scroll instantáneo primero para asegurar que funcione
        window.scrollTo(0, 0);
        if (document.documentElement) {
            document.documentElement.scrollTop = 0;
        }
        if (document.body) {
            document.body.scrollTop = 0;
        }

        // Luego hacer scroll suave después de un pequeño delay
        const scrollToTopSmooth = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        };

        // Ejecutar scroll suave después de que el DOM se actualice
        const timeout1 = setTimeout(() => {
            scrollToTopSmooth();
        }, 50);

        const timeout2 = setTimeout(() => {
            scrollToTopSmooth();
        }, 150);

        // Mover el foco al elemento principal de la página para accesibilidad
        const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
        
        if (mainContent) {
            // Solo mover el foco si no hay un elemento con foco activo (como un input)
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.isContentEditable
            );

            if (!isInputFocused) {
                // Usar setTimeout para asegurar que el scroll se complete primero
                setTimeout(() => {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                    // Remover el tabindex después de enfocar para no afectar el orden de tabulación
                    setTimeout(() => {
                        mainContent.removeAttribute('tabindex');
                    }, 100);
                }, 100);
            }
        }

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;
