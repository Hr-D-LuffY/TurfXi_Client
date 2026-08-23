export default async function Page({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Player profile</h1>
      <p className="mt-2 text-sm text-neutral-500">playerId: {playerId}</p>
      {/* TODO (matchStats): tiered stats — basic (Free) up to leaderboards/comparisons (Gold) */}
    </main>
  );
}
