import './Button.css';
import { forwardRef } from 'react';

/**
 * Componente Button reutilizable
 * @param {Object} props
 * @param {string} [props.variant='primary'] - primary | secondary | outline | ghost | danger
 * @param {string} [props.size='md'] - sm | md | lg
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {React.ReactNode} props.children - Contenido del botón
 */
const Button = forwardRef(({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    ...props
}, ref) => {
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            className={classNames}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            {leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
            <span className="btn-text">{children}</span>
            {rightIcon && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
