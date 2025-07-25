import React, { useRef } from "react";
import ReactDOM from "react-dom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number; // px, default 400
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusable = useRef<HTMLButtonElement | null>(null);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 h-full shadow-xl p-6 overflow-y-auto relative flex flex-col"
        style={{ width, maxWidth: 480 }}
        role="document"
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <button
          ref={firstFocusable}
          onClick={onClose}
          aria-label="Close drawer"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div>{children}</div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : ({} as HTMLElement)
  );
};

export default Drawer;
