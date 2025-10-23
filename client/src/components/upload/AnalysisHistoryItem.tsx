import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from 'lucide-react';

// Define the type for a single history item again for clarity
interface HistoryItem {
  id: string;
  created_at: string;
  file_name: string;
  analysis_summary: {
    diagnosis_summary: string;
  };
}

interface AnalysisHistoryItemProps {
  item: HistoryItem;
  navigate: NavigateFunction;
  viewType: 'desktop' | 'mobile';
}

const AnalysisHistoryItem: React.FC<AnalysisHistoryItemProps> = ({ item, navigate, viewType }) => {
  const isNormal = item.analysis_summary.diagnosis_summary.toLowerCase().includes('normal');
  const badgeVariant = isNormal ? 'default' : 'destructive';
  const badgeLabel = isNormal ? 'Normal' : 'Perlu Perhatian';

  const handleViewClick = () => {
    navigate("/results", { state: { analysisData: item } });
  };

  if (viewType === 'desktop') {
    return (
      <TableRow>
        <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
        <TableCell className="font-medium">{item.file_name}</TableCell>
        <TableCell>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="outline" size="sm" onClick={handleViewClick}>
            <Eye className="mr-2 h-4 w-4" />
            Lihat
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  if (viewType === 'mobile') {
    return (
      <Card className="p-4 flex justify-between items-center">
        <div>
          <p className="font-bold text-sm truncate max-w-[150px]">{item.file_name}</p>
          <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewClick}>
          <Eye className="h-4 w-4" />
        </Button>
      </Card>
    );
  }

  return null;
};

export default AnalysisHistoryItem;
