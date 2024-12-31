import PqrVsDepartmentChart from "@/components/charts/pqr/pqr-vs-deparment";
import { PqrVsTimeChart } from "@/components/charts/pqr/pqr-vs-time";
import PqrTable from "@/components/pqrTable";
import { getPQRS } from "@/services/api/pqr.service";

export default async function PQRPage() {
  const pqrs = await getPQRS();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 w-full">
        <PqrVsTimeChart pqrs={pqrs} />
        <PqrVsDepartmentChart pqrs={pqrs} />
      </div>

      <PqrTable pqrs={pqrs} />
    </div>
  );
}
