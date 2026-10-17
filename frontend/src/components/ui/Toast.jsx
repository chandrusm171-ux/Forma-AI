import { useState, useEffect, useCallback } from "react";

/**
 * Toast Notification Component
 *
 * Displays a brief, auto-dismissible notification for user feedback.
 *
 * @param {Object} props
 * @param {'success' | 'error' | 'info' | 'warning'} [props.type='info'] - Visual variant
 * @param {string} props.message - Notification text
 * @param {number} [props.duration=4000] - Auto-dismiss time in ms (0 = no auto-dismiss)
 * @param {boolean} [props.visible=false] - Controls visibility
 * @param {Function} [props.onClose] - Called when the toast is dismissed
 * @param {string} [props.className=''] - Extra CSS class names
 */
function Toast({
  type = "info",
  message,
  duration = 4000,
  visible = false,
  onClose,
  className = "",
}) {
  const [isExiting, setIsExiting] = useState(false);

  const dismiss = useCallback(() => {
    if (isExiting) return;

    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose?.();
    }, 300); // matches CSS exit animation duration
  }, [isExiting, onClose]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(dismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, dismiss]);

  if (!visible && !isExiting) return null;

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <div
      className={`ui-toast ui-toast-${type} ${isExiting ? "ui-toast-exit" : "ui-toast-enter"} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="ui-toast-icon" aria-hidden="true">
        {icons[type]}
      </span>
      <p className="ui-toast-message">{message}</p>
      <button
        type="button"
        className="ui-toast-close"
        onClick={dismiss}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
