'use client';

import { usePathname } from 'next/navigation';
import PortalSidebar from '@/components/portal/PortalSidebar';
import AssistantWidget from '@/components/chat/AssistantWidget';

export default function PortalScaffold({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen xl:flex">
      <PortalSidebar pathname={pathname} />
      <div className="flex min-h-screen flex-1 flex-col">
        {children}
      </div>
      <AssistantWidget channel="PORTAL" />
    </div>
  );
}
