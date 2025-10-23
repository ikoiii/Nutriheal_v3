import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import AnalysisHistoryItem from './AnalysisHistoryItem'; // We will create this next

// Define the type for a single history item based on what we saw in Upload.tsx
interface HistoryItem {
  id: string;
  created_at: string;
  file_name: string;
  analysis_summary: {
    diagnosis_summary: string;
  };
}

interface AnalysisHistoryListProps {
  isFetchingHistory: boolean;
  history: HistoryItem[];
}

const AnalysisHistoryList: React.FC<AnalysisHistoryListProps> = ({ isFetchingHistory, history }) => {
  const navigate = useNavigate();

  if (isFetchingHistory) {
    return (
      <>
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={`desktop-skeleton-${i}`}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Mobile Skeleton */}
        <div className="space-y-4 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={`mobile-skeleton-${i}`} className="h-28 w-full rounded-lg" />)}
        </div>
      </>
    );
  }

  if (history.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-center text-muted-foreground">
        Belum ada riwayat.
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <AnalysisHistoryItem key={item.id} item={item} navigate={navigate} viewType="desktop" />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {history.map((item) => (
          <AnalysisHistoryItem key={item.id} item={item} navigate={navigate} viewType="mobile" />
        ))}
      </div>
    </>
  );
};

export default AnalysisHistoryList;
