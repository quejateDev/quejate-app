import { Button } from "@/components/ui/button";
import type { TutelaFormData } from "../types";
import { useEffect, useState } from "react";
import {
  getMunicipalitiesByDepartment,
  getRegionalDepartments,
} from "@/services/api/location.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FUNDAMENTAL_RIGHTS } from "@/constants/fundamental-rights";
import { PQR } from "@/types/pqrsd";
import { typeMap } from "@/constants/pqrMaps";
import { Loader2 } from "lucide-react";
import { formatText } from "@/utils/formatText";

type TutelaFormGeneratorProps = {
  onGenerateDocument: (formData: TutelaFormData) => void;
  isGenerating: boolean;
  onClose: () => void;
  pqrData: PQR;
};

export function TutelaFormGenerator({
  onGenerateDocument,
  isGenerating,
  onClose,
  pqrData,
}: TutelaFormGeneratorProps) {

  const [formData, setFormData] = useState({
    fullName: "",
    documentNumber: "",
    city: "",
    cityId: "",
    department: pqrData.department?.name ?? "",
    rightViolated: "",
    entity: pqrData.entity.name ?? "",
    pqrDescription: pqrData.description || "",
  });

  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [municipalities, setMunicipalities] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getRegionalDepartments();
        setDepartments(data);
        setLoadingDepartments(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!selectedDepartment) {
      setMunicipalities([]);
      return;
    }

    setLoadingMunicipalities(true);

    const fetchMunicipalities = async () => {
      try {
        const data = await getMunicipalitiesByDepartment(selectedDepartment);
        setMunicipalities(data);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      } finally {
        setLoadingMunicipalities(false);
      }
    };

    fetchMunicipalities();
  }, [selectedDepartment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateDocument(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="border-muted border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentNumber">Número de documento</Label>
            <Input
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              className="border-muted border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select
              value={selectedDepartment || ""}
              onValueChange={(value) => {
                setSelectedDepartment(value);
                const selectedDept = departments.find((d) => d.id === value);
                setFormData((prev) => ({
                  ...prev,
                  department: selectedDept?.name || "",
                  city: "",
                }));
              }}
            >
              <SelectTrigger  className="border-muted border">
                <SelectValue placeholder="Seleccione un departamento" />
              </SelectTrigger>
              <SelectContent className="border-muted border">
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {formatText(department.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipality">Ciudad / Municipio</Label>
            <Select
              value={formData.cityId}
              onValueChange={(selectedId) => {
                const selectedMuni = municipalities.find(
                  (m) => m.id === selectedId
                );
                setFormData((prev) => ({
                  ...prev,
                  cityId: selectedId,
                  city: selectedMuni?.name || "",
                }));
              }}
              disabled={!selectedDepartment || loadingMunicipalities}
            >
              <SelectTrigger  className="border-muted border">
                <SelectValue
                  placeholder={
                    loadingMunicipalities
                      ? "Cargando..."
                      : !selectedDepartment
                        ? "Seleccione un departamento primero"
                        : "Seleccione un municipio"
                  }
                >
                  {formData.city}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality.id} value={municipality.id}>
                    {formatText(municipality.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rightViolated">Derecho vulnerado</Label>
            <Select
              value={formData.rightViolated}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  rightViolated: value,
                }))
              }
              required
            >
              <SelectTrigger className="border-muted border">
                <SelectValue placeholder="Selecciona un derecho" />
              </SelectTrigger>
              <SelectContent>
                {FUNDAMENTAL_RIGHTS.map((right) => (
                  <SelectItem key={right} value={right}>
                    {right}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity">Entidad demandada</Label>
            <Input
              id="entity"
              name="entity"
              value={formData.entity}
              readOnly
              className="bg-gray-100 border-muted border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pqrDescription">
            Descripción de tu {typeMap[pqrData.type].label.toLowerCase()}
          </Label>
          <textarea
            id="pqrDescription"
            name="pqrDescription"
            value={formData.pqrDescription}
            onChange={handleChange}
            className="flex w-full focus-visible:outline-none rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={isGenerating || !formData.department || !formData.city || !formData.rightViolated || !formData.pqrDescription}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando documento...
              </>
            ) : (
              "Generar tutela"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
