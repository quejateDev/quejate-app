import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Acerca de Nosotros</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nuestra misión es proporcionar soluciones innovadoras y de alta calidad que 
                transformen positivamente la vida de nuestros clientes, mientras mantenemos 
                un compromiso inquebrantable con la excelencia y la satisfacción del cliente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aspiramos a ser líderes reconocidos en nuestra industria, estableciendo 
                nuevos estándares de innovación y calidad, mientras construimos un futuro 
                más sostenible y próspero para nuestras comunidades.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuestra Historia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Fundada en [año], nuestra empresa comenzó con una visión clara de 
                transformar la industria. A lo largo de los años, hemos crecido de manera 
                constante, superando desafíos y alcanzando hitos significativos.
              </p>
              <Separator />
              <p className="text-muted-foreground">
                Hoy en día, continuamos construyendo sobre nuestros valores fundamentales 
                de innovación, integridad y excelencia, mientras nos adaptamos a las 
                necesidades cambiantes del mercado y nuestros clientes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 