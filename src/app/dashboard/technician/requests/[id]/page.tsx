

interface RequestDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const RequestDetailPage = async ({
  params,
}: RequestDetailPageProps) => {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">
        Request Details
      </h1>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">Request ID</p>
        <p className="mt-2 break-all font-semibold text-foreground">
          {id}
        </p>
      </div>
    </div>
  );
};

export default RequestDetailPage;
