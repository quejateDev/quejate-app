import { CardWrapper } from "./card-wrapper";


export const ErrorCard = () => {
  return (
    <CardWrapper 
      headerLabel="Ups! Algo salió mal" 
      backButtonLabel="Regresar al inicio de sesión" 
      backButtonHref="/auth/login"
    >
      <p className="text-center text-sm text-muted-foreground">
        {`Si el problema persiste, contáctanos.`}
      </p>
    </CardWrapper>
  );
};


// http://localhost:3000/auth/error?error=Configuration