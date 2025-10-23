import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

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

// Fungsi untuk menghasilkan slot waktu yang "dinamis"
const generateTimeSlots = () => {
  const allSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  // Acak dan ambil sebagian slot untuk simulasi ketersediaan
  return allSlots.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
};

export function useBookingForm() {
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [problemDescription, setProblemDescription] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots());
      setSelectedTime(""); // Reset waktu saat tanggal berubah
    }
  }, [selectedDate]);

  const handleBooking = useCallback(() => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Pemesanan Gagal", {
        description: "Harap pilih dokter, tanggal, dan waktu terlebih dahulu.",
      });
      return;
    }
    setIsBooking(true);
    // Simulasi panggilan API
    setTimeout(() => {
      toast.success("Pemesanan Berhasil!", {
        description: `Anda akan menerima konfirmasi untuk konsultasi dengan ${selectedDoctor.name} pada ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(selectedDate)} jam ${selectedTime}.`,
      });
      setSelectedDoctor(null);
      setSelectedDate(new Date());
      setSelectedTime("");
      setProblemDescription("");
      setIsBooking(false);
    }, 1500);
  }, [selectedDoctor, selectedDate, selectedTime]);

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
