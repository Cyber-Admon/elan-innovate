import { listUpcomingEvents } from "@/lib/google-calendar";
import AppointmentsList from "@/components/AppointmentsList";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const events = await listUpcomingEvents();

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-2 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Appointments
      </h1>
      <p className="mb-8 max-w-lg text-sm font-medium text-ink/60">
        Upcoming interviews and calls from your connected Google Calendar.
      </p>
      <AppointmentsList initialEvents={events} />
    </main>
  );
}