import React from "react";
import { useDailyCheckin } from "@/hooks/useDailyCheckin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckinSelect from "./checkin/CheckinSelect";

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({ isOpen, onClose }) => {
  const {
    energyLevel,
    setEnergyLevel,
    stressLevel,
    setStressLevel,
    sleepQuality,
    setSleepQuality,
    notes,
    setNotes,
    handleSubmit,
    isPending,
  } = useDailyCheckin(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check-in Harian Kesehatan</DialogTitle>
          <DialogDescription>
            Bagaimana perasaan Anda hari ini? Isi log harian Anda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <CheckinSelect
            id="energy"
            label="Tingkat Energi"
            value={energyLevel}
            onValueChange={setEnergyLevel}
          />
          <CheckinSelect
            id="stress"
            label="Tingkat Stres"
            value={stressLevel}
            onValueChange={setStressLevel}
          />
          <CheckinSelect
            id="sleep"
            label="Kualitas Tidur"
            value={sleepQuality}
            onValueChange={setSleepQuality}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Merasa sedikit pusing hari ini..."
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Log Harian"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailyCheckinModal;
