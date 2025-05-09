import ScanHistoryClientPage from '@/components/ScanHistoryClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan History - Ingredient Insights',
  description: 'Review your past ingredient scans.',
};

export default function HistoryPage() {
  return <ScanHistoryClientPage />;
}
