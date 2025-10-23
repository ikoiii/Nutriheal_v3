import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KeyMetric } from '@/hooks/useAnalysisData';

interface KeyMetricsCardProps {
  metrics: KeyMetric[];
}

const KeyMetricsCard: React.FC<KeyMetricsCardProps> = ({ metrics }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Metrik Medis Kunci</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metrik</TableHead>
              <TableHead className="text-right">Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics?.length > 0 ? (
              metrics.map((metric, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{metric.metric}</TableCell>
                  <TableCell className="text-right">{metric.value}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">Data tidak tersedia.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default KeyMetricsCard;
