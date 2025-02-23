"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { ImageUpload } from "@/components/ui/image-upload"
import { Entity, Category, Department, Municipality } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { getMunicipalitiesByDepartment, getRegionalDepartments } from "@/services/api/location.service";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  email: z.string().email().optional().or(z.literal("")),
  municipalityId: z.string().min(1, "Debe seleccionar un municipio"),
})

interface EntityFormProps {
  entity?: Entity
}

export function EntityForm({ entity }: EntityFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: entity?.name || "",
      description: entity?.description || "",
      imageUrl: entity?.imageUrl || "",
      categoryId: entity?.categoryId || "",
      email: entity?.email || "",
      municipalityId: entity?.municipalityId || "",
    },
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        
        const categoriesResponse = await fetch("/api/category")
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        const departmentsData = await getRegionalDepartments()
        setDepartments(departmentsData)

        if (entity?.municipalityId) {
          for (const department of departmentsData) {
            const municipalities = await getMunicipalitiesByDepartment(department.id)
            const foundMunicipality = municipalities.find(
              (m: Municipality) => m.id === entity.municipalityId
            )
            
            if (foundMunicipality) {
              setSelectedDepartment(department.id)
              setMunicipalities(municipalities)
              break
            }
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Error",
          description: "Error al cargar los datos iniciales",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [entity])

  useEffect(() => {
    if (!selectedDepartment) {
      setMunicipalities([])
      return
    }

    const fetchMunicipalities = async () => {
      try {
        const municipalitiesData = await getMunicipalitiesByDepartment(selectedDepartment)
        setMunicipalities(municipalitiesData)
      } catch (error) {
        console.error("Error fetching municipalities:", error)
        toast({
          title: "Error",
          description: "Error al cargar los municipios",
          variant: "destructive",
        })
      }
    }

    fetchMunicipalities()
  }, [selectedDepartment])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true)
      const url = entity 
        ? `/api/entities/${entity.id}`
        : "/api/entities"
      const method = entity ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Error al guardar la entidad")

      toast({
        title: "Éxito",
        description: entity 
          ? "Entidad actualizada correctamente"
          : "Entidad creada correctamente",
      })

      router.push("/admin/entity")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Error al guardar la entidad",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Departamento</FormLabel>
            <Select
              value={selectedDepartment || ""}
              onValueChange={(value) => {
                setSelectedDepartment(value)
                form.setValue("municipalityId", "")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            control={form.control}
            name="municipalityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipio</FormLabel>
                <Select
                  disabled={!selectedDepartment}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un municipio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {municipalities.map((municipality) => (
                      <SelectItem key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ImageUpload 
          form={form} 
          name="imageUrl" 
          label="Logo o Imagen"
          folder="banners"
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/entity")}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : entity ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  )
}