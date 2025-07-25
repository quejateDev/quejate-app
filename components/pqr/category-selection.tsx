"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Category, RegionalDepartment, Municipality } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Heart, Loader2, ChevronLeft, ImageIcon, Search } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VerificationBadge } from "../ui/verification-badge";
import { useFavoriteEntities } from "@/hooks/useFavoriteEntities";
import dynamic from "next/dynamic";
import { formatText } from "@/utils/formatText";

interface SimpleEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  municipalityId: string | null;
  regionalDepartmentId: string | null;
  isVerified: boolean;
}
const EntityCard: React.FC<{
  entity: SimpleEntity;
  isFavorite: boolean;
  onToggleFavorite: (entityId: string) => Promise<void>;
  onEntitySelect: (id: string) => void;
  favLoading: boolean;
  userId?: string;
}> = ({ entity, isFavorite, onToggleFavorite, onEntitySelect, favLoading, userId }) => {
  const [isToggling, setIsToggling] = useState(false);
  useEffect(() => {
    if (!favLoading) setIsToggling(false);
  }, [favLoading]);
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling || favLoading || !userId) return;
    setIsToggling(true);
    try {
      await onToggleFavorite(entity.id);
    } finally {
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-fav-btn]')) {
      return;
    }
    onEntitySelect(entity.id);
  };

  return (
    <Card
      className={cn(
        "relative p-4 cursor-pointer hover:border-primary transition-colors",
        "flex flex-col items-center justify-center gap-4"
      )}
      onClick={handleCardClick}
      tabIndex={-1}
    >
      {userId && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              data-fav-btn
              className="absolute top-2 right-2 z-30 hover:bg-gray-100"
              disabled={isToggling || favLoading}
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isToggling || favLoading ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Heart className={cn(
                  "h-5 w-5 transition-colors",
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 group-hover:text-primary"
                )}/>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFavorite ? 'Quitar de entidades favoritas' : 'Agregar a entidades favoritas'}</p>
          </TooltipContent>
        </Tooltip>
      )}
      <div className="flex items-center justify-center w-full">
        <div className="relative w-16 h-16 py-4">
          {entity.imageUrl ? (
            <Image
              src={entity.imageUrl}
              alt={entity.name}
              fill
              className="object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <h3 className="font-semibold text-center">{formatText(entity.name)}</h3>
        {entity.isVerified && <VerificationBadge />}
      </div>
      {entity.description && (
        <p className="text-xs text-gray-500 text-justify line-clamp-2 px-2">
          {entity.description}
        </p>
      )}
    </Card>
  );
};

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
  { ssr: false }
);


interface CategorySelectionProps {
  categories: (Category & {
    entities: SimpleEntity[];
  })[];
  onEntitySelect: (entityId: string) => void;
}

export function CategorySelection({
  categories,
  onEntitySelect,
}: CategorySelectionProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.id || "";
  const { favorites, loading: favLoading, toggleFavorite } = useFavoriteEntities<SimpleEntity>(userId);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entitySearchQuery, setEntitySearchQuery] = useState("");
  const [departments, setDepartments] = useState<RegionalDepartment[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string | null>(null);
  const [toggling, setToggling] = useState<{ [id: string]: boolean }>({});
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);


  const handleEntitySelect = (entityId: string) => {
    router.push(`/dashboard/pqrs/create/${entityId}`);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getRegionalDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      const fetchMunicipalities = async () => {
        setLoadingMunicipalities(true);
        try {
          const data =
            await getMunicipalitiesByDepartment(selectedDepartmentId);
          setMunicipalities(data);
        } catch (error) {
          console.error("Error fetching municipalities:", error);
        } finally {
          setLoadingMunicipalities(false);
        }
      };
      fetchMunicipalities();
    } else {
      setMunicipalities([]);
      setLoadingMunicipalities(false);
    }
  }, [selectedDepartmentId]);

  const filteredCategories = categories.filter((category) => {
    const matchesName = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDescription = category.description
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const hasEntities = category.entities.length > 0;
    return (matchesName || matchesDescription) && hasEntities;
  });

  const filteredEntities = selectedCategory
    ? categories
        .find((cat) => cat.id === selectedCategory.id)
        ?.entities.filter((entity) => {
          const matchesName = entity.name
            .toLowerCase()
            .includes(entitySearchQuery.toLowerCase());
          const matchesDescription = entity.description
            ? entity.description.toLowerCase().includes(entitySearchQuery.toLowerCase())
            : true;
          
          const matchesDepartment = selectedDepartmentId
            ? loadingMunicipalities 
              ? true
              : entity.regionalDepartmentId === selectedDepartmentId ||
                (entity.municipalityId && municipalities.some((m) => m.id === entity.municipalityId))
            : true;
          const matchesMunicipality = selectedMunicipalityId
            ? entity.municipalityId === selectedMunicipalityId
            : true;
          return (
            matchesName &&
            matchesDescription &&
            matchesDepartment &&
            matchesMunicipality
          );
        })
    : [];

  const handleToggleFavorite = async (entityId: string) => {
    setToggling((prev) => ({ ...prev, [entityId]: true }));
    try {
      await toggleFavorite(entityId);
    } finally {
      setToggling((prev) => ({ ...prev, [entityId]: false }));
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDepartmentId(null);
                  setSelectedMunicipalityId(null);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {selectedCategory.name}
            </div>
          ) : (
            "Selecciona una categoría"
          )}
        </h2>
      </div>

      {!selectedCategory && (
        <p className="text-sm text-gray-600">
          Descubre las categorías disponibles y encuentra exactamente lo que
          buscas. Si no sabes a qué categoría pertenece una entidad, utiliza la
          barra de búsqueda e ingresa palabras clave relacionadas con su nombre
          o descripción para localizarla fácilmente.
        </p>
      )}

      {!selectedCategory && (
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar categoría"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {selectedCategory && (
        <>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar entidad"
              value={entitySearchQuery}
              onChange={(e) => setEntitySearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64">
              <Select
                value={selectedDepartmentId || ""}
                onValueChange={(value) => {
                  setSelectedDepartmentId(value || null);
                  setSelectedMunicipalityId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Buscar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {formatText(department.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDepartmentId && (
              <div className="w-full md:w-64">
                <Select
                  value={selectedMunicipalityId || ""}
                  onValueChange={(value) =>
                    setSelectedMunicipalityId(value || null)
                  }
                  disabled={!selectedDepartmentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar por municipio" />
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
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCategory ? (
          filteredEntities && filteredEntities.length > 0 ? (
            filteredEntities.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                isFavorite={favorites.some((fav: SimpleEntity) => fav.id === entity.id)}
                favLoading={!!toggling[entity.id]}
                onToggleFavorite={handleToggleFavorite}
                onEntitySelect={handleEntitySelect}
                userId={userId}
              />
            ))
          ) : (
            <p className="text-left text-sm text-gray-500 col-span-full">
              No se encontraron entidades con este criterio de búsqueda.
            </p>
          )
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Card
              key={category.id}
              className={cn(
                "p-4 cursor-pointer hover:border-primary transition-colors",
                "flex flex-col items-center gap-1"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="relative w-32 h-32 flex items-center">
                {category.imageUrl ? (
                  category.imageUrl.endsWith('.json') ? (
                    <div className="w-32 h-32 flex">
                      <LottiePlayer
                        autoplay={false}
                        loop
                        hover
                        src={category.imageUrl}
                      />
                    </div>
                  ) : (
                    <div className="relative w-24 h-24">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-500 text-justify px-2">
                  {category.description}
                </p>
              )}
            </Card>
          ))
        ) : (
          <p className="text-left text-sm text-gray-500 col-span-full">
            No se encontraron categorías con este criterio de búsqueda.
          </p>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
