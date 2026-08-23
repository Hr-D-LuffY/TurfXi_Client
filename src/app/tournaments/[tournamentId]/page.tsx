export default async function Page({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Tournament details</h1>
      <p className="mt-2 text-sm text-neutral-500">tournamentId: {tournamentId}</p>
      {/* TODO (tournaments): bracket, schedule, entry, MVP/top-scorer tracking */}
    </main>
  );
}
