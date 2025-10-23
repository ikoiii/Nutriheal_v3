import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Medication } from '@/hooks/useAnalysisData';

interface MedicationsCardProps {
  medications: Medication[];
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ medications }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Daftar Obat</CardTitle>
      </CardHeader>
      <CardContent>
        {medications && medications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Obat</TableHead>
                <TableHead className="text-right">Dosis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell className="text-right">{med.dosage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Tidak ada daftar obat yang tercatat.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationsCard;
