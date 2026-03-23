import PublicNavbar from '@/components/marketing/PublicNavbar';
import PublicFooter from '@/components/marketing/PublicFooter';
import AssistantWidget from '@/components/chat/AssistantWidget';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
      <WhatsAppButton />
      <AssistantWidget channel="PUBLIC" />
    </div>
  );
}
