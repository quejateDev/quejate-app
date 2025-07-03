import { NextResponse } from "next/server";


interface LawyerVerificationRequest {
  TipoDocumento: string;
  NumeroDocumento: string;
  Calidad: string;
}

interface Mensaje {
  Respuesta: string | null;
  TipoMensaje: number;
}

interface CertificadoVigencia {
  Certificado: string;
  Encalidad: string;
  Estado: string;
  FechaCreacion: string;
  FechaExpedicion: string;
  IdHojaDeVida: string;
  MotivoNoVigencia: string;
  NumeroTarCarLice: string;
  ObservacionesPenaAccesoria: string | null;
}

interface ExternalServiceResponse {
  ConsultaPublicaCertificadoVigenciaResult: {
    Mensaje: Mensaje;
    PublicaCertificadoVigencia: CertificadoVigencia[];
  };
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { TipoDocumento, NumeroDocumento, Calidad }: Partial<LawyerVerificationRequest> = requestBody;

    if (!TipoDocumento || !NumeroDocumento || !Calidad) {
      return NextResponse.json(
        { error: "Parámetros requeridos: TipoDocumento (1=CC), NumeroDocumento, Calidad (1=Abogado)" },
        { status: 400 }
      );
    }

    const externalServiceUrl = "https://sirna.ramajudicial.gov.co/STS/Servicio/ConsultaDisciplinaria.svc/json/ConsultaPublicaCertificadoVigencia";
    
    const externalRequestBody = {
      parametros: {
        TipoDocumento,
        NumeroDocumento,
        Calidad
      }
    };

    const response = await fetch(externalServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(externalRequestBody)
    });

    if (!response.ok) {
      throw new Error(`Error en el servicio externo: ${response.status}`);
    }

    const data: ExternalServiceResponse = await response.json();

    const result = data.ConsultaPublicaCertificadoVigenciaResult;
    
    if (result.Mensaje.TipoMensaje === 0) {
      return NextResponse.json({ 
        isValid: false,
        message: "No se encontró información del abogado" 
      });
    }

    if (result.Mensaje.TipoMensaje === 2 && result.PublicaCertificadoVigencia.length > 0) {
      const abogado = result.PublicaCertificadoVigencia[0];
      return NextResponse.json({
        isValid: true,
        data: {
          nombreCalidad: abogado.Encalidad,
          estado: abogado.Estado,
          numeroTarjeta: abogado.NumeroTarCarLice,
          fechaExpedicion: (() => {
            const match = abogado.FechaExpedicion.match(/\d+/);
            return match ? new Date(parseInt(match[0])) : null;
          })()
        }
      });
    }

    return NextResponse.json({ 
      isValid: false,
      message: "Respuesta inesperada del servicio" 
    });

  } catch (error: unknown) {
    console.error("Error en verificación de abogado:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al verificar el abogado";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        isValid: false 
      },
      { status: 500 }
    );
  }
}