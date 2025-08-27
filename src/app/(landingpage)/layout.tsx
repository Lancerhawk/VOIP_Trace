import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VoIP Trace - Advanced VoIP Call Log Monitoring System',
  description: 'Detect suspicious activities and fraudulent communication patterns in VoIP call logs. Built for law enforcement and telecom administrators.',
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}