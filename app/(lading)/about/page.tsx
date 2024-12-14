import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Soluciones PQR</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Razón de Ser</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Entendemos que cada PQR representa la voz de un cliente que merece ser escuchado. 
                Nacimos como respuesta a la necesidad de transformar la manera en que las empresas 
                gestionan sus Peticiones, Quejas y Reclamos, convirtiendo cada interacción en una 
                oportunidad de mejora y fidelización.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propuesta de Valor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ofrecemos una solución integral que revoluciona la gestión de PQR:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Automatización y agilización de procesos de PQR</li>
                <li>Seguimiento en tiempo real de solicitudes</li>
                <li>Análisis de datos para identificar patrones y mejoras</li>
                <li>Comunicación efectiva entre empresa y cliente</li>
                <li>Reducción de tiempos de respuesta y costos operativos</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuestro Compromiso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nos dedicamos a transformar cada PQR en una experiencia positiva, 
                empoderando a las empresas con herramientas tecnológicas efectivas.
              </p>
              <Separator />
              <p className="text-muted-foreground">
                Creemos firmemente que cada PQR es una oportunidad para construir 
                relaciones más sólidas con los clientes y mejorar continuamente los 
                procesos empresariales, manteniendo siempre una cultura de servicio 
                centrada en soluciones.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 