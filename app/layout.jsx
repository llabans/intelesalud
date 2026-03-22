import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'InteleSalud | Telemedicina multiespecialidad',
  description:
    'Plataforma de telemedicina en Peru. Consulta con medicos especialistas verificados por videollamada. Cardiologia, pediatria, nutricion, dermatologia y mas. Desde S/79.',
  keywords: ['telemedicina', 'peru', 'medico online', 'consulta virtual', 'especialista', 'teleconsulta', 'InteleSalud'],
  openGraph: {
    title: 'InteleSalud | Telemedicina multiespecialidad',
    description: 'Consulta con medicos especialistas verificados por videollamada. Desde S/79.',
    siteName: 'InteleSalud',
    url: 'https://intelesalud.medicalcore.app',
    type: 'website',
    locale: 'es_PE',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'InteleSalud',
  url: 'https://intelesalud.medicalcore.app',
  description: 'Plataforma de telemedicina multiespecialidad en Peru',
  medicalSpecialty: ['Cardiology', 'Pediatrics', 'Dermatology', 'Nutrition', 'Endocrinology', 'MentalHealth'],
  availableService: {
    '@type': 'MedicalTherapy',
    name: 'Teleconsulta medica',
    serviceType: 'Telemedicine',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="min-h-screen bg-white font-[var(--font-sans)] text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
