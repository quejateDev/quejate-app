import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPQRSById } from "@/services/api/pqr.service";

async function getPQRById(id: string) {
  try {
    // Replace this with your actual API call or database query
    const response = await getPQRSById(id);
    return response;
  } catch (error) {
    console.error("Error fetching PQR:", error);
    return null;
  }
}

export default async function PQRDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pqr = await getPQRById(params.id);

  console.log(pqr);

  if (!pqr) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>PQR Details</CardTitle>
          <CardDescription>
            View detailed information about this PQR request
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span>{pqr.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{pqr.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={pqr.status === "OPEN" ? "default" : "secondary"}>
                    {pqr.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(pqr.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{pqr.creator?.firstName} {pqr.creator?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{pqr.creator?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{pqr.creator?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {pqr.description}
            </p>
          </div>

          {/* Response (if available) */}
          {pqr.response && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Response</h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {pqr.response}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
