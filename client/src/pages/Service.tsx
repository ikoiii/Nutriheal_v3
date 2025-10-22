import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Stethoscope, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingForm } from "@/hooks/useBookingForm";

export default function Service() {
  const {
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
  } = useBookingForm();

  return (
    <div className="container mx-auto py-8 pt-24 md:pt-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Konsultasi dengan Dokter Gizi</h1>
        <p className="text-lg text-muted-foreground mt-2">Jadwalkan sesi konsultasi pribadi dengan ahli gizi profesional kami.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Daftar Dokter */}
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Pilih Dokter</h2>
            {doctors.map((doctor) => (
              <Card 
                key={doctor.name} 
                className={`cursor-pointer transition-all duration-300 ${selectedDoctor?.name === doctor.name ? 'border-primary ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Formulir Pemesanan */}
        <div className="lg:col-span-2"> 
            <Card className="h-full"> 
                <CardHeader>
                    <CardTitle className="text-2xl">Jadwalkan Konsultasi</CardTitle>
                    {selectedDoctor ? 
                        <CardDescription>Anda akan memesan konsultasi dengan <span className="font-bold text-primary">{selectedDoctor.name}</span>. Silakan pilih tanggal dan waktu yang tersedia.</CardDescription> : 
                        <CardDescription>Pilih dokter dari daftar di sebelah kiri untuk memulai proses penjadwalan konsultasi Anda.</CardDescription>
                    }
                </CardHeader>
                <CardContent className="space-y-6">
                {!selectedDoctor ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                        <Stethoscope className="mx-auto h-16 w-16 mb-4"/>
                        <p className="font-semibold">Silakan pilih dokter terlebih dahulu</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">1. Pilih Tanggal</h3>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                        locale={id} 
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">2. Pilih Waktu</h3>
                                <Select onValueChange={setSelectedTime} value={selectedTime}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jam tersedia" className="w-full" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">3. Deskripsi Keluhan (Opsional)</h3>
                                <Textarea 
                                    placeholder="Jelaskan singkat keluhan atau tujuan konsultasi Anda..."
                                    value={problemDescription}
                                    onChange={(e) => setProblemDescription(e.target.value)}
                                    rows={8}
                                />
                            </div>
                            <Button onClick={handleBooking} className="w-full" size="lg" disabled={isBooking}>
                                {isBooking ? "Memproses..." : "Pesan Sekarang"}
                            </Button>
                        </div>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}