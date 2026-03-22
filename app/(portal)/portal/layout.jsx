import PortalScaffold from '@/components/portal/PortalScaffold';

export const dynamic = 'force-dynamic';

export default function PortalLayout({ children }) {
  return <PortalScaffold>{children}</PortalScaffold>;
}
