'use client';

import * as React from 'react';
import { Menu, X, MoreHorizontal } from 'lucide-react';

const SidebarContext = React.createContext(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 */
export const SidebarProvider = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(true);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isHovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar, isHovered, setHovered }}>
      <div className="flex min-h-screen w-full overflow-hidden bg-background">
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {"icon" | "none"} [props.collapsible]
 * @param {"default" | "inset"} [props.variant]
 */
export const Sidebar = ({ children, className = '', collapsible = "icon", variant = "default", ...props }) => {
  const { open, openMobile, setOpenMobile, isMobile, setHovered } = useSidebar();

  if (isMobile) {
    return (
      <>
        {openMobile && (
          <div 
            className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm transition-all duration-300 animate-in fade-in" 
            onClick={() => setOpenMobile(false)}
          />
        )}
        <aside 
          className={`fixed left-0 top-0 bottom-0 z-[101] w-[280px] bg-white dark:bg-slate-900 border-r dark:border-slate-800 transform transition-transform duration-300 ease-out flex flex-col shadow-2xl ${
            openMobile ? 'translate-x-0' : '-translate-x-full'
          } ${className}`}
          {...props}
        >
          {children}
        </aside>
      </>
    );
  }

  // Desktop
  const widthClass = open ? 'w-[280px]' : 'w-[80px] hover:w-[280px]';
  
  return (
    <aside 
      onMouseEnter={() => !open && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex-col border-r bg-white dark:bg-slate-900 dark:border-slate-800 transition-all duration-300 ease-in-out flex shrink-0 group/sidebar ${widthClass} ${className}`} 
      {...props}
    >
      <div className="flex flex-col h-full w-full overflow-hidden">
        {children}
      </div>
    </aside>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 flex flex-col transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarContent = ({ children, className = '', ...props }) => (
  <div className={`flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-t dark:border-slate-800 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarMenu = ({ children, className = '', ...props }) => (
  <div className={`space-y-1 ${className}`} {...props}>{children}</div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarMenuItem = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {React.ReactElement} [props.render]
 * @param {boolean} [props.isActive]
 * @param {"default" | "lg"} [props.size]
 * @param {string} [props.tooltip]
 */
export const SidebarMenuButton = ({ children, className = '', render, isActive, size = "default", tooltip, ...props }) => {
  const { open, isMobile, isHovered } = useSidebar();
  const showLabel = isMobile || open || isHovered;

  const baseClass = `
    flex items-center w-full px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 group/menu-item overflow-hidden
    ${isActive 
      ? 'bg-primary/10 text-primary shadow-sm' 
      : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'} 
    ${size === 'lg' ? 'h-14' : 'h-10'}
    ${!showLabel ? 'justify-center px-0' : 'gap-3'}
    ${className}
  `;

  const content = (
    <>
      {children}
      {!showLabel && tooltip && (
        <div className="fixed left-20 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/menu-item:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap font-bold uppercase tracking-widest shadow-xl">
          {tooltip}
        </div>
      )}
    </>
  );

  if (render) {
    return React.cloneElement(render, { 
      className: baseClass, 
      'data-active': isActive,
      ...props, 
      children: content 
    });
  }

  return (
    <button className={baseClass} data-active={isActive} {...props}>
      {content}
    </button>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarGroup = ({ children, className = '', ...props }) => (
  <div className={`py-3 px-2 ${className}`} {...props}>{children}</div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarGroupLabel = ({ children, className = '', ...props }) => {
  const { open, isMobile, isHovered } = useSidebar();
  const showLabel = isMobile || open || isHovered;
  if (!showLabel) return <div className="h-4" />;

  return (
    <div className={`px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 ${className}`}>
      {children}
    </div>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarGroupContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const SidebarInset = ({ children, className = '', ...props }) => (
  <div className={`flex flex-1 min-w-0 flex-col bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {boolean} [props.asChild]
 * @param {React.ReactNode} [props.children]
 */
export const SidebarTrigger = ({ className = '', asChild, children, ...props }) => {
  const { toggleSidebar } = useSidebar();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        toggleSidebar();
      },
      ...props
    });
  }

  return (
    <button 
      onClick={toggleSidebar}
      className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 text-slate-600 dark:text-slate-400 ${className}`}
      {...props}
    >
      {children || <Menu className="size-5" />}
    </button>
  );
};

// Additional components used in AppSidebar.tsx
/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const Avatar = ({ children, className = '', ...props }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>{children}</div>
);

/**
 * @param {Object} props
 * @param {string} src
 * @param {string} alt
 * @param {string} [props.className]
 */
export const AvatarImage = ({ src, alt, className = '', ...props }) => (
  <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} {...props} />
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const AvatarFallback = ({ children, className = '', ...props }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ${className}`} {...props}>
    {children}
  </div>
);
