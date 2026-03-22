import './globals.css';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';

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
    <html lang="es">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(26,143,170,0.06),transparent_28%),linear-gradient(180deg,#faf8f6_0%,#f3efeb_100%)] text-slate-900 antialiased">
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
