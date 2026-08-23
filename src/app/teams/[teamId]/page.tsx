export default async function Page({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Team profile</h1>
      <p className="mt-2 text-sm text-neutral-500">teamId: {teamId}</p>
      {/* TODO (teams): roster, captain/vice-captain, recruitment status, team stats */}
    </main>
  );
}
