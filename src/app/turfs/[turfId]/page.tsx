export default async function Page({
  params,
}: {
  params: Promise<{ turfId: string }>;
}) {
  const { turfId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Turf details</h1>
      <p className="mt-2 text-sm text-neutral-500">turfId: {turfId}</p>
      {/* TODO (turfs): gallery, weather, reviews, availability, booking CTA */}
    </main>
  );
}
