import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Previewer } from 'pagedjs';
import { renderToStaticMarkup } from 'react-dom/server';
import './PagedPreview.css';

const PagedPreview = ({ children, cvData }) => {
    const containerRef = useRef(null);
    const scrollerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const previewerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const scaleRef = useRef(1);
    const [hasRenderedOnce, setHasRenderedOnce] = useState(false);
    const hasRenderedOnceRef = useRef(false);

    const updateScale = () => {
        const parentWidth = scrollerRef.current?.clientWidth;
        if (!parentWidth || parentWidth < 200) return;

        const a4WidthPx = 820;
        const newScaleRaw = Math.min(1, (parentWidth - 40) / a4WidthPx);
        const nextScale = Math.max(0.3, newScaleRaw);
        if (Math.abs(nextScale - scaleRef.current) > 0.01) {
            scaleRef.current = nextScale;
            setScale(nextScale);
        }
    };

    useLayoutEffect(() => {
        const raf = requestAnimationFrame(() => updateScale());
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (!scrollerRef.current) return;
        const ro = new ResizeObserver(() => updateScale());
        ro.observe(scrollerRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!children || !containerRef.current) return;

        let isMounted = true;

        const renderPaged = async () => {
            if (!isMounted) return;
            setIsLoading(true);

            // Clean previous content
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }

            try {
                // Initialize Previewer
                // We create a new instance each time to avoid state pollution, 
                // or we can reuse if we are careful. Recreating is safer for stability.
                const previewer = new Previewer();
                previewerRef.current = previewer;

                // Render children to HTML string
                // We use renderToStaticMarkup to get the initial HTML of the template
                const htmlContent = renderToStaticMarkup(children);

                // Collect all current stylesheets to pass to Paged.js
                // This ensures that the styles loaded in the app (including Tailwind or custom CSS) apply to the preview
                const stylesheets = Array.from(document.styleSheets)
                    .map(sheet => {
                        try {
                            return sheet.href;
                        } catch (e) {
                            return null;
                        }
                    })
                    .filter(href => href !== null);

                // Add a custom style for page size and breaks
                const customStyle = document.createElement('style');
                // Margin 0 ensures we use the full paper. We can add padding to body if needed, 
                // but usually Paged.js puts content in the margin boxes if defined.
                // We'll set a very small safe margin of 5mm.
                customStyle.innerHTML = `
                    @page {
                        size: A4;
                        margin: 0; 
                    }
                    /* Add padding to the page content area itself to act as 'margin' 
                       but without Paged.js clipping it improperly. */
                    .pagedjs_page_content {
                        padding: 8mm; /* Reduced to 8mm for better fit */
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Prevent awkward breaks */
                    h1, h2, h3, h4, h5, h6 {
                        break-after: avoid;
                    }
                    img, .profile-image {
                        break-inside: avoid;
                    }
                    p, li {
                        orphans: 3; 
                        widows: 3;
                    }
                `;
                document.head.appendChild(customStyle);

                // Run Paged.js preview with safety check
                if (containerRef.current && isMounted) {
                    await previewer.preview(
                        htmlContent,
                        stylesheets,
                        containerRef.current
                    );
                }

                if (isMounted) {
                    requestAnimationFrame(() => {
                        updateScale();
                        requestAnimationFrame(() => {
                            updateScale();
                            if (!hasRenderedOnceRef.current) {
                                hasRenderedOnceRef.current = true;
                                setHasRenderedOnce(true);
                            }
                        });
                    });
                }

                // Clean up custom style
                if (document.head.contains(customStyle)) {
                    document.head.removeChild(customStyle);
                }

            } catch (error) {
                console.error("Paged.js Rendering Error:", error);
                // Only write error if container still exists and wasn't unmounted
                if (containerRef.current && isMounted) {
                    // Paged.js sometimes throws 'getBoundingClientRect' on unmount, we can ignore if it's just that
                    if (!error.message?.includes('getBoundingClientRect')) {
                        containerRef.current.innerHTML = `<div class="paged-error">Error: ${error.message}</div>`;
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Debounce rendering
        const timeoutId = setTimeout(() => {
            renderPaged();
        }, 1000); // Increased debounce to 1s to reduce flicker/crashes

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [children, cvData]); // Re-render when content or data changes

    return (
        <div className="paged-preview-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Scaler needs to handle scrolling. 
                 Actually, the SCALER should be the scrollable viewport or contained within one.
                 If we scale the container, we need to ensure the scrollbars logic still works.
                 
                 Better approach:
                 Wrapper (overflow: auto) -> 
                   Scaler (min-height, center) -> 
                     Container
             */}
            <div
                className="paged-preview-scroller"
                ref={scrollerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto', // Enable vertical scrolling
                    overflowX: 'hidden'
                }}
            >
                <div
                    className="paged-preview-scaler"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        opacity: hasRenderedOnce ? 1 : 0,
                        transition: 'opacity 160ms ease, transform 160ms ease',
                        /* 
                           Important: When scaling down, the height also reduces visually.
                           But the layout space remains.
                           If we don't adjust physical height or handle layout, scrolling might feel weird.
                           For now, simple scaling usually works if the scroller parent handles the overflow. 
                        */
                        minHeight: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '20px',
                        paddingBottom: '20px'
                    }}
                >
                    <div className="paged-preview-container" ref={containerRef}></div>
                </div>
            </div>
            {isLoading && (
                <div className="paged-loading">
                    <span>Generando vista previa paginada...</span>
                </div>
            )}
        </div>
    );
};

export default PagedPreview;
