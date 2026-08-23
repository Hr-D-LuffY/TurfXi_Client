export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Booking details</h1>
      <p className="mt-2 text-sm text-neutral-500">bookingId: {bookingId}</p>
      {/* TODO (bookings): booking detail, split-billing status, cancellation action */}
    </main>
  );
}
