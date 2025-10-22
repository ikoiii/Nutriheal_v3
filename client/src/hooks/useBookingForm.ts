import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

const doctors = [
  {
    name: "Dr. Amanda Sari",
    specialization: "Ahli Gizi Klinis",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Dr. Budi Santoso",
    specialization: "Nutrisionis Anak",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Dr. Citra Lestari",
    specialization: "Konsultan Diet",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export function useBookingForm() {
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const handleBooking = useCallback(() => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Pemesanan Gagal",
        description: "Harap pilih dokter, tanggal, dan waktu terlebih dahulu.",
      });
      return;
    }
    setIsBooking(true);
    // Simulasi panggilan API
    setTimeout(() => {
      toast({
        title: "Pemesanan Berhasil!",
        description: `Anda telah berhasil memesan konsultasi dengan ${selectedDoctor.name} pada ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(selectedDate)} jam ${selectedTime}.`,
      });
      setSelectedDoctor(null);
      setSelectedDate(new Date());
      setSelectedTime("");
      setProblemDescription("");
      setIsBooking(false);
    }, 1500);
  }, [selectedDoctor, selectedDate, selectedTime, toast]);

  return {
    doctors,
    timeSlots,
    selectedDoctor,
    setSelectedDoctor,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    problemDescription,
    setProblemDescription,
    isBooking,
    handleBooking,
  };
}
