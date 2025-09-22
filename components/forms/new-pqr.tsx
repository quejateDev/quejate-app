"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, Info, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { FileUpload } from "../ui/file-upload";
import dynamic from "next/dynamic";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useLoginModal } from "@/providers/LoginModalProvider";
import { usePQRForm } from "@/hooks/usePQRForm";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

// Dynamically import ReCAPTCHA to avoid SSR issues
// @ts-ignore
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});


type NewPQRFormProps = {
  entityId: string;
};

export function NewPQRForm({ entityId }: NewPQRFormProps) {
  const userId = useCurrentUser()?.id;
  const { setIsOpen } = useLoginModal();
  
  const {
    form,
    departments,
    customFields,
    currentUser,
    isLoading,
    isLoadingInitial,
    openDepartment,
    setOpenDepartment,
    onSubmit,
    setRecaptchaToken,
  } = usePQRForm(entityId, userId);

  if (isLoadingInitial) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
      <div className="md:bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-300">
        <div className="p-0 md:p-6">
          <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="grid gap-4 pt-6">
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Solicitud</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border border-gray-300">
                            <SelectValue placeholder="Seleccione el tipo de solicitud" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PETITION">Petición</SelectItem>
                          <SelectItem value="COMPLAINT">Queja</SelectItem>
                          <SelectItem value="CLAIM">Reclamo</SelectItem>
                          <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
                          <SelectItem value="REPORT">Denuncia</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              {departments.length > 0 && (
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (Opcional)</FormLabel>
                      <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDepartment}
                            className="w-full justify-between bg-white border border-gray-300"
                          >
                            {field.value
                              ? departments.find(department => department.id === field.value)?.name
                              : "Seleccione un área ..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command className="w-full">
                            <CommandInput placeholder="Buscar área..." />
                            <CommandList className="max-h-[300px] w-full overflow-y-auto">
                              <CommandEmpty>No se encontró ningún área.</CommandEmpty>
                              <CommandGroup className="w-full">
                                <CommandItem
                                  value=""
                                  onSelect={() => {
                                    field.onChange(undefined);
                                    setOpenDepartment(false);
                                  }}
                                  className="w-full"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      !field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  Ningún área seleccionada
                                </CommandItem>
                                {departments.map(department => (
                                  <CommandItem
                                    key={department.id}
                                    value={department.name}
                                    onSelect={() => {
                                      field.onChange(department.id);
                                      setOpenDepartment(false);
                                    }}
                                    className="w-full"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === department.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {department.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tema de la PQRSD" className="border border-gray-300" />
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
                      <Textarea
                        {...field}
                        placeholder="Descripción de la PQRSD"
                        rows={5}
                        className="border border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {customFields.map(field => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={`customFields.${field.name}`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        {field.type === "textarea" ? (
                          <Textarea
                            {...formField}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        ) : field.type === "email" ? (
                          <Input
                            type="email"
                            {...formField}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        ) : field.type === "phone" ? (
                          <Input
                            type="tel"
                            {...formField}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        ) : (
                          <Input
                            {...formField}
                            type={field.type}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="space-y-2">
                <FileUpload
                  form={form}
                  name="attachments"
                  label="Archivos Adjuntos"
                  folder="pqr"
                  multiple={true}
                  accept="*"
                  maxSize={10}
                />
              </div>

              {!userId && !form.watch("isAnonymous") && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium">Datos de Contacto</h3>
                  <p className="text-sm text-gray-600">
                    Como no estás registrado, necesitamos tus datos de contacto para que la entidad pueda responder a tu PQRSD.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ingresa tu nombre completo" 
                            className="border border-gray-300"
                            required={!form.watch("isAnonymous")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            placeholder="correo@ejemplo.com" 
                            className="border border-gray-300"
                            required={!form.watch("isAnonymous")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="tel"
                            placeholder="Ej: 3001234567" 
                            className="border border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex flex-col space-y-1 mt-6">
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          id="isAnonymous"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked && !userId) {
                              form.setValue("guestName", "");
                              form.setValue("guestEmail", "");
                              form.setValue("guestPhone", "");
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel>
                        ¿Desea enviar esta PQRSD de forma anónima?
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <p className="text-xs text-gray-500">
                  Si marca esta opción, su nombre y datos de contacto no serán
                  visibles para la entidad ni para otros usuarios.
                </p>
              </div>

              {userId && currentUser?.phone && !form.watch("isAnonymous") && (
                <div className="flex flex-col space-y-1">
                  <FormField
                    control={form.control}
                    name="includePhone"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            id="includePhone"
                            checked={field.value}
                            onCheckedChange={checked => field.onChange(checked)}
                          />
                        </FormControl>
                        <FormLabel>
                          ¿Desea incluir su número de teléfono de contacto?
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    Se incluirá su número: {currentUser.phone}. Para cambiar este número, vaya a su perfil.
                  </p>
                </div>
              )}

              <div className="flex flex-col space-y-1 mb-6">
                <FormField
                  control={form.control}
                  name="isPrivate"
                  disabled={!userId}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          id="isPrivate"
                          checked={!field.value}
                          disabled={!userId}
                          onCheckedChange={checked => field.onChange(!checked)}
                        />
                      </FormControl>
                      <FormLabel className={`${!userId ? "line-through" : ""} flex flex-col gap-2`}>
                        <span>¿Desea publicar esta PQRSD en el muro?</span>
                      </FormLabel>
                      {!userId && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Esta opción solo está permitida para usuarios registrados
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </FormItem>
                  )}
                />
                {!userId && (
                  <span
                    className="text-blue-500 underline font-semibold cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    Inicia sesión para publicar tu PQRSD en el muro.
                  </span>
                )}
                <p className="text-xs text-gray-500">
                  Si marca esta opción, su queja será visible para otras
                  personas en la sección de denuncias públicas.
                </p>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                {/* @ts-ignore */}
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token: string | null) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Al enviar esta PQRSD, aceptas automáticamente nuestros{' '}
                <Link 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Términos y Condiciones
                </Link>
                {' '}y{' '}
                <Link 
                  href="/policy" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Política de Privacidad
                </Link>
                .
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar PQRSD"
                )}
              </Button>
            </div>
          </form>
        </Form>
        </div>
      </div>
    </div>
  );
}