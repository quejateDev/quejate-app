import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            TÉRMINOS Y CONDICIONES DE USO - QUEJATE.COM.CO
          </h1>
          <p className="text-gray-600">En vigor a partir del 4/8/2025 11:30:57</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed text-justify">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Introducción</h2>
          <p className="mb-6">
            Estos Términos y Condiciones (en adelante &quot;T&C&quot;) regulan el acceso y uso de la plataforma tecnológica QUEJATE.COM.CO
            y de la aplicación móvil asociada (en adelante, la &quot;Plataforma&quot;), operada por PLATAFORMA DE QUEJAS CIUDADANA SAS.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Nuestra Misión</h3>
          <p className="mb-4">
            En QUEJATE.COM.CO tenemos la misión de empoderar a la ciudadanía en el ejercicio efectivo de sus derechos, facilitando la gestión, seguimiento y resolución de las PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias) frente a entidades públicas y privadas.
          </p>
          <p className="mb-4">
            A través de nuestra plataforma digital ofrecemos a los usuarios una herramienta innovadora que les permite monitorear en tiempo real el cumplimiento de los plazos legales, recibir alertas oportunas y acceder a soluciones prácticas cuando sus solicitudes no son atendidas, incluyendo la generación asistida de tutelas y la posibilidad de escalar sus inconformidades ante los entes de control competentes.
          </p>
          <p className="mb-4">
            Al mismo tiempo, creamos un espacio confiable en el que profesionales del Derecho pueden registrarse para ofrecer servicios de asesoría jurídica especializada, y brindamos a las entidades públicas la opción de administrar de manera eficiente las PQRSD que reciban, optimizando su gestión administrativa.
          </p>
          <p className="mb-6">
            Nuestra misión es construir un puente transparente, accesible y confiable entre la ciudadanía, las entidades y los profesionales del Derecho, contribuyendo así al fortalecimiento del control social, la defensa de los derechos fundamentales y la consolidación de una democracia más participativa y eficiente.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Funcionamiento de la Aplicación</h3>
          <p className="mb-4">
            La aplicación QUEJATE.COM.CO tiene como objetivo ser una herramienta para gestionar las diferentes PQRSD que tengan usuarios, con base en sus inconformidades. En ese sentido permite:
          </p>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">A los Usuarios:</h4>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Trasladar sus inconformidades (PQRSD) a las entidades destino,</li>
              <li>Permitirles a los Usuarios hacer un seguimiento &quot;en vivo&quot; de sus PQRSD, monitorear si existe o no respuesta</li>
              <li>Llegado el término legal de vencimiento de la PQRSD, indicarle al usuario las acciones administrativas o judiciales que puede emprender con base en el marco normativo colombiano y en su caso particular. Tales acciones pueden ser, por ejemplo, generar una acción de tutela o escalar la inconformidad a la no atención oportuna en los entes de control correspondiente.</li>
            </ol>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">A los Profesionales del Derecho:</h4>
            <ol className="list-decimal list-inside ml-4 space-y-1" start={4}>
              <li>Registrarse en la plataforma y ofrecer sus servicios profesionales en asesorías o consultorías jurídicas de acuerdo con especialidad.</li>
            </ol>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">A las entidades públicas:</h4>
            <ol className="list-decimal list-inside ml-4 space-y-1" start={5}>
              <li>El servicio de administración de las PRQSD que los usuarios creen y sean radicadas en la entidad correspondiente.</li>
            </ol>
          </div>

          <p className="mb-6">
            i) exhibe diferentes productos y servicios de consumo de forma publicitaria para que puedan servir de referencia a los Usuarios, ii) facilita el encuentro entre Usuarios y Los Establecimientos de Comercio para la realización del vínculo contractual, iii) permite el uso de la plataforma de pagos iv) sirve de medio de envío de comunicaciones entre los Usuarios y Los Establecimientos de Comercio. v) Sirve como medio de comunicación entre QUEJATE.COM.CO y su Centro de ayuda y el Comercio y entre QUEJATE.COM.CO y los Usuarios finales.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Productos y Servicios</h3>
          <p className="mb-4">
            QUEJATE.COM.CO como plataforma tecnológica otorga al Usuario una licencia de uso no exclusiva, no descargable que se compone de los siguientes Servicios:
          </p>

          <ol className="list-decimal list-inside ml-4 space-y-2 mb-4">
            <li>Radicar PRQSD a las entidades públicas o que presten servicios públicos.</li>
            <li>En caso de que su PRQSD no haya sido respondida, la plataforma ofrece opciones al usuario, entre las cuales está permite:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Generar un tutela gratuita con IA y guiarle para su correcta interposición</li>
                <li>Escalar una queja ante los entes de control (Procuraduría, Personería, Contraloría, etc) según corresponda, por la no atención a la solicitud.</li>
                <li>Explorar la base de datos de abogados suscritos a la plataforma y que ofrezcan sus servicios en temas de asesorías para procesos judiciales o adminsitrativos.</li>
              </ul>
            </li>
          </ol>

          <p className="mb-4">
            La celebración de la relación contractual entre Usuarios y La Plataforma se da con personas que se encuentren en el territorio nacional o que, estando en el extranjero, tengan interés en presentar una PRQSD a una entidad ubicada en territorio colombiano de acuerdo con la promesa de valor de la QUEJATE.COM.CO.
          </p>
          <p className="mb-6">
            A través de la Plataforma se exhiben los servicios de QUEJATE.COM.CO cuya gestión de compra es adquirida por los Usuarios quienes buscan satisfacer una necesidad privada, personal, comercial o familiar, y en ningún momento pretenden la comercialización, reventa o cualquier otro tipo de transacción comercial o interés con los productos adquiridos.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.4. Alcance del Servicio</h3>
          <p className="mb-4">La Plataforma ofrece:</p>
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-6">
            <li>Modalidad gratuita: traslado de PQRSD redactadas por el propio Usuario a entidades competentes, seguimiento de términos legales y generación de borradores de tutelas mediante IA.</li>
            <li>Modalidad de pago: redacción y presentación de PQRSD y tutelas por profesionales en derecho debidamente registrados en la Plataforma.</li>
            <li>Servicios de intermediación para la contratación de asesorías jurídicas con Profesionales en Derecho registrados.</li>
            <li>Servicios a entidades públicas para la administración de PQRSD.</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.5. Limitaciones de QUEJATE.COM.CO</h3>
          <p className="mb-4">QUEJATE.COM.CO no controla y no se compromete a:</p>
          <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
            <li>La plataforma no se compromete a que la entidad a la cual se envió la PQRSD de respuesta a su solicitud.</li>
            <li>La Plataforma no se compromete a que la Tutela generada y radicada ante la rama judicial tenga los resultados esperados por el Usuario.</li>
            <li>La plataforma no se hace responsable de los acuerdos de pago que tenga el Usuario con los abogados inscritos en la Plataforma,</li>
            <li>La plataforma no se hace responsable del cumplimiento de las obligaciones adquiridas entre los abogados y Usuarios, toda vez que ello se encuentra enmarcado en sus responsabilidades profesionales.</li>
            <li>La plataforma no se hace responsable del mal uso que los usuarios puedan tener en la publicación de mensajes, imágenes, videos,audio, documentos que atenten contra la integridad de otras personas o entidades.</li>
            <li>La plataforma no garantiza que las tutelas generadas por Inteligencia Artificial estén totalmente correctas, toda vez que dicha tecnología puede cometer errores. El usuario deberá revisar la totalidad de los documentos generados y verificar la información importante en aras a que estén acorde a las necesidades del usuario.</li>
            <li>La plataforma no se hace responsable de la información enviada a las entidades públicas o privadas.</li>
            <li>La plataforma no se hace responsable del contenido que el usuario publique en su muro privado o público.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Aceptación de Términos</h2>
          <p className="mb-4">
            Al acceder o utilizar la aplicación QUEJATE.COM.CO, usted acepta estos términos y condiciones (&quot;Condiciones&quot;) sin limitación ni calificación. Si no está de acuerdo con estas Condiciones, no debe utilizar la aplicación.
          </p>
          <p className="mb-4">
            Este documento se entiende como parte integral de todos los actos y contratos que se ejecuten o celebren mediante los sistemas de oferta y comercialización comprendidos en este sitio entre los usuarios de este sitio y PLATAFORMA DE QUEJAS CIUDADANA SAS, propietaria de la plataforma QUEJATE.COM.CO. (en adelante &quot;QUEJATE.COM.CO&quot;).
          </p>
          <p className="mb-4">
            Cada vez que un usuario se registra o accede a los servicios que ofrece La Plataforma reconoce y comprende que ha leído, ha aceptado y está de acuerdo con estos términos. Igualmente si el usuario hiciera uso del Sitio de QUEJATE.COM.CO o su App, ello implicará la aceptación plena de las condiciones establecidas en estos Términos y Condiciones Generales y en las Políticas de PLATAFORMA DE QUEJAS CIUDADANA SAS. Por dicha utilización del sitio y/o sus servicios, el Usuario se obligará a cumplir expresamente con las mismas, no pudiendo alegar el desconocimiento de tales Términos y Condiciones Generales, de la Política de Privacidad o de documentos concordantes y complementarios.
          </p>
          <p className="mb-6">
            Si no acepta los términos y condiciones contenidos en este documento, no instale ni haga uso de la aplicación. Si ya la instaló y no está de acuerdo con estos términos y condiciones, desinstale la App y no haga uso de la página web.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1. Capacidad Legal</h3>
          <p className="mb-4">
            Los Servicios de QUEJATE.COM.CO sólo podrán ser contratados por personas que tengan capacidad legal para contratar. Los actos de contratación que realicen en este sitio menores de edad o personas que no cuenten con capacidad legal para contratar, serán responsabilidad de sus padres, tutores, curadores o encargados, y por tanto se considerarán realizados por éstos en ejercicio de la representación legal con la que cuentan.
          </p>
          <p className="mb-6">
            Quien registre un Usuario como empresa o entidad pública, deberá tener capacidad para contratar a nombre de tal entidad y de obligar a la misma en los términos de este Acuerdo. Así mismo, todo Usuario de La Plataforma manifiesta haber suministrado información real, veraz y fidedigna; por ende, de forma expresa e inequívoca declara que ha leído, que entiende y que acepta la totalidad de las situaciones reguladas en el presente escrito de Términos y Condiciones de Uso de la Plataforma, por lo que se compromete al cumplimiento total de los deberes, obligaciones, acciones y omisiones aquí expresadas. La Plataforma podrá tener algún mecanismo con el fin de verificar la edad del usuario con lo cual al momento de registrarse puede incluir un campo obligatorio para la fecha de nacimiento o requerir documentación idónea para acreditar la representación legal.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2. Políticas Adicionales</h3>
          <p className="mb-6">
            Estas Condiciones incluyen nuestras políticas operativas, como la Política de Cookies y la Política de Privacidad. Al aceptar estas Condiciones, confirma que ha leído y aceptado nuestra Política de Privacidad.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3. Definiciones:</h3>
          <p className="mb-4">Para los efectos de estos términos y condiciones se entiende por:</p>

          <div className="space-y-3 mb-6">
            <div>
              <strong>Administrador:</strong> Es la persona responsable de controlar y velar por el buen funcionamiento de La Plataforma.
            </div>
            <div>
              <strong>Aliado estratégico:</strong> Definición legal: Persona o empresa que colabora con QUEJATE.COM.CO en la prestación de servicios o aquellos con los cuales podrá hacer uso de servicios afines a los prestados por la Plataforma.
              <br />Ejemplo práctico: Un proveedor de hosting que almacena la base de datos de la plataforma.
            </div>
            <div>
              <strong>Autoridad de control:</strong> Definición legal: Entidad estatal que vigila el cumplimiento de las normas de protección de datos.
              <br />Ejemplo práctico: Superintendencia de Industria y Comercio en Colombia.
            </div>
            <div>
              <strong>Cliente:</strong> Le apostamos al público en general, entidades públicas, profesional en derecho, colegios, entes de control y vigilancia.
            </div>
            <div>
              <strong>Compañía:</strong> Es la Empresa que ha celebrado con QUEJATE.COM.CO una alianza para formar parte de la plataforma QUEJATE.COM.CO.
            </div>
            <div>
              <strong>Consentimiento expreso:</strong> Definición legal: Autorización libre, previa e informada para tratar datos personales.
              <br />Ejemplo práctico: Aceptar la política de datos antes de registrarse.
            </div>
            <div>
              <strong>Datos personales:</strong> Definición legal: Cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable; así como cualquier información que las normas legales o interpretación de ellas permitan inferir como un Dato Personal.
              <br />Ejemplo práctico: Nombre, número de cédula, correo electrónico.
            </div>
            <div>
              <strong>Datos sensibles:</strong> Definición legal: Información que afecta la intimidad o puede dar lugar a discriminación.
              <br />Ejemplo práctico: Historial médico o creencias religiosas.
            </div>
            <div>
              <strong>Entidad pública:</strong> Definición legal: Organismo estatal que presta un servicio o ejerce funciones administrativas.
              <br />Ejemplo práctico: La Procuraduría General de la Nación.
            </div>
            <div>
              <strong>IA:</strong> Herramienta de Inteligencia Artificial utilizada para generar documentos jurídicos en modalidad gratuita y/o paga.
            </div>
            <div>
              <strong>Intermediario tecnológico:</strong> Definición legal: Plataforma que conecta a usuarios con terceros sin asumir responsabilidad directa por sus actos.
              <br />Ejemplo práctico: QUEJATE conecta ciudadanos con abogados independientes.
            </div>
            <div>
              <strong>Perfilamiento automatizado:</strong> Definición legal: Uso de algoritmos para evaluar o predecir aspectos personales.
              <br />Ejemplo práctico: Sugerir acciones legales en función de la queja registrada.
            </div>
            <div>
              <strong>Plataforma:</strong> Se refiere a QUEJATE.COM.CO.
            </div>
            <div>
              <strong>PQRSD:</strong> Definición legal: Petición, Queja, Reclamo, Sugerencia o Denuncia regulada por la Ley 1755 de 2015.
              <br />Ejemplo práctico: Cuando un ciudadano solicita información a una entidad pública o presenta una queja por mal servicio.
            </div>
            <div>
              <strong>Profesional en Derecho:</strong> Definición legal: Abogado con tarjeta profesional vigente que se registre en la Plataforma para ofrecer servicios jurídicos.
              <br />Ejemplo práctico: Un abogado que se registra en QUEJATE.COM.CO para asesorar en derecho laboral.
            </div>
            <div>
              <strong>Red:</strong> Redeban Multicolor S.A. o cualquier operador de infraestructura para el sistema QUEJATE.COM.CO o cualquier plataforma de pagos utilizada por la Plataforma.
            </div>
            <div>
              <strong>Tipo de ambiente:</strong> QUEJATE.COM.CO se desarrolla en ambiente Web
            </div>
            <div>
              <strong>Tratamiento:</strong> Significa cualquier operación o conjunto de operaciones sobre Datos Personales, tales como la recolección, almacenamiento, uso, circulación, transmisión, transferencia o supresión.
            </div>
            <div>
              <strong>Transacción:</strong> Cualquier operación que realice el Beneficiario en un datáfono o dispositivo de acceso, por la cual se realice una captura y enrutamiento por la Red QUEJATE.COM.CO, incluyendo, pero no limitado a consultas de saldos y errores en la digitación de la clave respectiva.
            </div>
            <div>
              <strong>Transferencia internacional de datos:</strong> Definición legal: Envío de datos personales a un país extranjero.
              <br />Ejemplo práctico: Almacenar información en servidores de un proveedor en EE. UU.
            </div>
            <div>
              <strong>Tutela:</strong> Definición legal: Mecanismo judicial para la protección inmediata de derechos fundamentales.
              <br />Ejemplo práctico: Una persona interpone tutela para que se le autorice un tratamiento médico urgente.
            </div>
            <div>
              <strong>Usuario:</strong> Cualquier persona natural o jurídica que acceda o utilice la Plataforma, incluyendo ciudadanos, entidades públicas, empresas y Profesionales en Derecho.
              <br />Ejemplo práctico: Un ciudadano que presenta una PQRSD o un abogado que ofrece asesorías.
            </div>
            <div>
              <strong>Ventanas emergentes (Pop-Ups):</strong> Ventana o aviso de internet que emerge automáticamente en cualquier momento cuando se utiliza la Plataforma, especialmente utilizado para la formalización del contrato electrónico entre Usuarios y La Plataforma.
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.4 Cuenta de Usuario</h3>
          <p className="mb-4">
            Para utilizar la aplicación, debe registrarse y crear una cuenta (&quot;Cuenta&quot;). Es su responsabilidad mantener la información de su cuenta actualizada y precisa.
          </p>
          <p className="mb-4">
            El usuario, dispondrá de su dirección de email y en el proceso de registro definirá una clave secreta (en adelante la &quot;Clave&quot;) que le permitirá el acceso personalizado, confidencial y seguro. El Usuario tendrá la posibilidad de cambiar la Clave de acceso, para lo cual deberá sujetarse al procedimiento establecido en la Plataforma. El Usuario se obliga a mantener la confidencialidad de su Clave de acceso, asumiendo total responsabilidad por ello.
          </p>
          <p className="mb-4">
            Dicha Clave es de uso personal, y su entrega a terceros no involucra responsabilidad de QUEJATE.COM.CO, de las Compañías o de los Aliados en caso de utilización indebida, negligente y/o incorrecta.
          </p>
          <p className="mb-6">
            El Usuario será responsable por todas las operaciones efectuadas en y desde su Cuenta, pues el acceso a la misma está restringido al ingreso y uso de una Clave secreta, de conocimiento exclusivo del Usuario. El usuario se compromete a notificar a QUEJATE.COM.CO en forma inmediata y por los medios idóneos y fehacientes, cualquier uso no autorizado de su Cuenta y/o Clave, así como el ingreso por terceros no autorizados a la misma. Se aclara que está prohibida la venta, cesión, préstamo o transferencia de la Clave y/o Cuenta bajo ningún título.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.5. Prohibiciones</h3>
          <p className="mb-4">Usted no debe:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-6">
            <li>Usar el nombre de otra persona sin autorización.</li>
            <li>Utilizar un nombre ofensivo o vulgar.</li>
            <li>Compartir su cuenta con otros usuarios.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Uso del Servicio</h2>
          <p className="mb-4">Para hacer uso de los servicios de la plataforma se deben cumplir los siguientes pasos:</p>
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-4">
            <li>Registrarse. Crear un perfil en la plataforma. hay una opción donde puedes interponer el PQRSD sin estar registrado pero no podrás hacerle seguimiento desde la plataforma.</li>
            <li>Aceptar Política de datos</li>
            <li>Aceptar Términos y condiciones</li>
            <li>Crear una PQRSD</li>
            <li>Desde su perfil de usuario puede monitorear el vencimiento de la PQRSD. si esta ha vencido aparecerá un signo de admiración preguntándole si su PQRSD fue atendida o no.</li>
            <li>Si la PQRSD no fue atendida la plataforma le ofrece la opción de generar tutelas o escalar la no atención de las misma a los entes de control.</li>
            <li>Si una PQRSD no fue atendida la plataforma le pregunta al usuario si desea buscar un abogado que esté inscrito en la plataforma y solicitar su servicio para una asesoría.</li>
          </ol>
          <p className="mb-6">
            QUEJATE.COM.CO buscará que las entidades entreguen respuesta al usuario de acuerdo con los términos establecidos en la ley. En cuanto a los abogados contactados a través de la plataforma, el término de las asesorías dependerá de los acuerdos que realicen de manera directa el usuario y el correspondiente profesional.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Precio</h2>
          <p className="mb-4">
            El precio indicado para los planes pagos de los servicios incluidos en la plataforma, son de exclusiva responsabilidad del Usuario.
          </p>
          <p className="mb-6">
            Un resumen de los costos le será informado al usuario final con el fin de que lo acepte o no. En caso de aceptarlo, le será debitado de la forma como lo haya definido en la operación.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Cobro por parte de QUEJATE.COM.CO</h3>
          <p className="mb-6">
            El precio será cobrado a través de La Plataforma QUEJATE.COM.CO y el Usuario podrá pagar utilizando tarjetas aceptadas u otros métodos disponibles en la aplicación.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2. Políticas de reembolso</h3>
          <p className="mb-6">
            Para el caso de los planes en modalidad de pago, las políticas de reembolso y los procedimientos correspondientes se definirán de manera expresa en la oferta de cada uno de dichos planes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Quejas y Soporte al Cliente</h2>
          <p className="mb-6">
            Los Usuarios podrán denunciar cualquier violación a los Términos y Condiciones de Uso por parte de otros Usuarios, de la que tenga conocimiento, a través del correo electrónico soporte@quejate.com.co con el fin de que QUEJATE.COM.CO tome las medidas que estén a su alcance respecto a La Platafoma, adicionalmente podria seleccionar la categoría QUEJATE dentro de la plataforma donde el usuario podría colocar su PQRSD para su atención en relación con la propia Plataforma.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Obligaciones especiales</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1. Obligaciones de QUEJATE.COM.CO</h3>
          <p className="mb-4">En virtud de los presentes términos QUEJATE.COM.CO, se obliga a:</p>
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-6">
            <li>Suministrar información acerca de los servicios disponibles por parte de cada Aliado.</li>
            <li>Informar suficientemente sobre los medios habilitados para que los Usuarios realicen pagos;</li>
            <li>Informar en el momento indicado y con suficiencia los datos de los Abogados inscritos en la plataforma y la especialidad de cada uno;</li>
            <li>Enviar al correo electrónico suministrado por el Usuario resumen del encargo y constancia de la transacción;</li>
            <li>Poner a disposición de los usuarios los términos y condiciones de uso de La Plataforma de forma actualizada;</li>
            <li>Utilizar la información únicamente para los fines establecidos en los presentes términos;</li>
            <li>Utilizar mecanismos de información y validación durante la transacción como ventanas emergentes (Pop Ups), mensajes de confirmación, entre otros, que permitan al Usuario aceptar o no cada paso del proceso de compra.</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2. Obligaciones Especiales de los Profesionales en Derecho</h3>
          <p className="mb-4">Se consideran obligaciones especiales de los Abogados en el contexto de la plataforma los siguientes:</p>
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-6">
            <li>Cumplir la Ley 1123 de 2007 (Código Disciplinario del Abogado).</li>
            <li>Mantener tarjeta profesional vigente y sin sanciones disciplinarias activas.</li>
            <li>Responder por la calidad y licitud de las asesorías y documentos emitidos.</li>
            <li>Guardar estricta confidencialidad sobre la información del cliente.</li>
            <li>Abstenerse de captar clientes por fuera de la Plataforma cuando el contacto inicial se haya generado a través de ella.</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Otras disposiciones</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1. Deberes del Usuario</h3>
          <p className="mb-4">Con la aceptación de los presentes términos El Usuario se obliga a:</p>
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-6">
            <li>Suministrar información veraz y fidedigna al momento de crear o modificar su Cuenta de Usuario;</li>
            <li>Abstenerse de transferir a terceros los datos de validación (nombre de usuario y contraseña);</li>
            <li>Abstenerse de utilizar la Plataforma para realizar actos contrarios a la moral, la ley, el orden público y buenas costumbres en contra de QUEJATE.COM.CO, los Abogados, otros usuarios o de terceros;</li>
            <li>Pagar oportunamente la contraprestación económica definida en el contrato electrónico que estos términos y condiciones implican;</li>
            <li>Informar inmediatamente a QUEJATE.COM.CO en caso de olvido o usurpación de los datos de validación;</li>
            <li>Abstenerse de realizar conductas atentatorias del funcionamiento de La Plataforma;</li>
            <li>Abstenerse de suplantar la identidad de otros Usuarios;</li>
            <li>Abstenerse de descifrar, descompilar, hacer ingeniería invertida o desensamblar cualquier elemento de La Plataforma o de cualquiera de sus partes;</li>
            <li>Habilitar la utilización de ventanas emergentes durante la operación;</li>
            <li>En general todas aquellas conductas necesarias para la ejecución del negocio jurídico, como: i) la recepción de los productos solicitados, ii) exhibir la identificación en caso de venta de productos de uso restringido, iii) verificar al momento de la validación que los productos seleccionados sí corresponden a los necesitados, iv) informarse sobre las instrucciones de uso y consumo de los productos</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2. Requisitos Para Uso</h3>
          <p className="mb-4">
            Para acceder a la Plataforma, el USUARIO debe contar con un acceso a la Red Internet, abonar las tarifas de acceso y conexión correspondientes, además tener el equipo y los sistemas informáticos necesarios para realizar la conexión a la Red, incluyendo un terminal que sea adecuado al efecto (ordenador, teléfono, etc.) y un módem u otro dispositivo de acceso. Además, deberá tener disponible algún medio de pago habilitado para pagos en línea.
          </p>
          <p className="mb-4">
            QUEJATE.COM.CO no se responsabiliza por la certeza de los Datos Personales provistos por sus Usuarios. Los Usuarios garantizan y responden, en cualquier caso, de la exactitud, veracidad, vigencia y autenticidad de los Datos Personales ingresados. Cada miembro sólo podrá ser titular de 1 (una) cuenta QUEJATE.COM.CO, no pudiendo acceder a más de 1 (una) cuenta QUEJATE.COM.CO con distintas direcciones de correo electrónico o falseando, modificando y/o alterando sus datos personales de cualquier manera posible. Si se verifica o sospecha un uso fraudulento y/o malintencionado y/o contrario a estos Términos y Condiciones y/o contrarios a la buena fe, QUEJATE.COM.CO tendrá el derecho inapelable de dar por terminados los créditos, nota-créditos, dar de baja las cuentas y hasta de perseguir judicialmente a los infractores.
          </p>
          <p className="mb-4">
            QUEJATE.COM.CO se reserva el derecho de solicitar algún comprobante y/o dato adicional a efectos de corroborar los Datos Personales, así como de suspender temporal o definitivamente a aquellos Usuarios cuyos datos no hayan podido ser confirmados. En estos casos de inhabilitación, QUEJATE.COM.CO podrá dar de baja la compra efectuada, sin que ello genere derecho alguno a resarcimiento, pago y/o indemnización.
          </p>
          <p className="mb-6">
            QUEJATE.COM.CO se reserva el derecho de rechazar cualquier solicitud de registro o de cancelar un registro previamente aceptado, sin que esté obligado a comunicar o exponer las razones de su decisión y sin que ello genere algún derecho a indemnización o resarcimiento.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3. Suspensión De La Cuenta QUEJATE.COM.CO</h3>
          <p className="mb-4">
            Suspensión. Con el fin de mantener un entorno seguro para los usuarios, nos reservamos el derecho de suspender las cuentas que incumplan las disposiciones de QUEJATE.COM.CO. Entre los motivos frecuentes de la suspensión, se incluyen los siguientes:
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <strong>Sospecha de Falsedad:</strong> En caso de que los datos no coincidan, exista confusión o no se pueda identificar a un usuario. Igualmente, cuando la cuenta tenga características de Spam. Lamentablemente, puede ocurrir que se suspenda por error la cuenta de una persona real, en cuyo caso trabajaremos con esa persona para asegurarnos de que se reactive su cuenta.
            </div>
            <div>
              <strong>Riesgos para la seguridad de la cuenta:</strong> Si sospechamos o hemos sido notificados de que una cuenta se hackeó o se vulneró, podemos suspenderla hasta que esté protegida y se la pueda restablecer a su titular, con el fin de disminuir la posibilidad de actividades maliciosas provocadas por el ataque.
            </div>
            <div>
              <strong>Comportamientos abusivos:</strong> Podemos suspender una cuenta si se denunció que incumple las Reglas relativas al abuso. Cuando una cuenta presenta comportamientos abusivos, como el envío de amenazas o la suplantación de identidad de otras cuentas, podemos suspenderla temporalmente o, en algunos casos, de forma permanente.
            </div>
          </div>

          <p className="mb-6">
            Para reactivar la cuenta, el usuario o establecimiento de comercio deberá hacer el seguimiento correspondiente y seguir las instrucciones de la plataforma.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.4. Formación Del Consentimiento En Los Contratos Celebrados A Través De Este Sitio</h3>
          <p className="mb-4">
            A través de La Plataforma, QUEJATE.COM.CO permite el acceso de los servicios indicados en este documento, que podrán ser adquiridos por los Usuarios a través de la aceptación, por vía electrónica, y utilizando los mecanismos que el mismo sitio ofrece para ello. Toda aceptación de oferta quedará sujeta a la condición suspensiva de que el establecimiento bancario o medio de pago electrónico valide la transacción. En consecuencia, para toda operación que se efectúe en La Plataforma, la confirmación, validación o verificación del pago recibido por la entidad bancaria, será requisito para la formación del consentimiento. Para validar la transacción QUEJATE.COM.CO podrá verificar: a) Que valida y acepta el medio de pago ofrecido por el usuario, b) Que los datos registrados por el Usuario en el sitio coinciden con los proporcionados al efectuar su aceptación de cotización, c) Que el pago es acreditado por el Usuario.
          </p>
          <p className="mb-4">
            El consentimiento se entenderá formado desde el momento en que se recibe el pago o se valide la transacción en aquellos casos en los que QUEJATE.COM.CO lo requiera. La compra de bien o servicio es efectuada por el Usuario es irrevocable salvo en circunstancias excepcionales, tales como que QUEJATE.COM.CO cambie sustancialmente la descripción del artículo después de realizada alguna cotización.
          </p>
          <p className="mb-6">
            La venta y despacho de los productos está condicionada a su disponibilidad y a las existencias de producto. Cuando el producto no se encuentre disponible, QUEJATE.COM.CO lo notificará de inmediato al cliente y le dará la opción para devolver el valor total del precio pagado o modificar la orden.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.5. Propiedad Intelectual</h3>
          <p className="mb-4">
            Cada usuario se compromete a respetar los derechos de autor, la marca, secreto comercial, derechos morales u otros derechos de propiedad intelectual, de publicidad o privacidad y/o derechos de autor. Todo el contenido incluido o puesto a disposición del Usuario en La Plataforma, incluyendo textos, gráficas, logos, íconos, imágenes, archivos de audio, descargas digitales y cualquier otra información (el &quot;Contenido&quot;), es de propiedad de PLATAFORMA DE QUEJAS CIUDADANA SAS o ha sido licenciada a ésta por los proveedores de QUEJATE.COM.CO.
          </p>
          <p className="mb-4">
            La información, contenidos y material suministrado a La Plataforma, está protegido por derechos de autor, marcas registradas conforme a la legislación de la República de Colombia, la Comunidad Andina (CAN), la Organización Mundial de Propiedad Intelectual (OMPI), así como por las disposiciones de tratados internacionales. Cada Usuario, por el mero uso de La Plataforma reconoce y acepta que todo el contenido de La aplicación, incluyendo todos los derechos de propiedad intelectual asociados, son propiedad exclusiva de La Plataforma y de sus licenciantes.
          </p>
          <p className="mb-4">
            La aplicación dará por terminado el servicio unilateralmente si el usuario infringe los derechos de autor, la marca, secreto comercial, derechos morales u otros derechos de propiedad intelectual, de publicidad o privacidad.
          </p>
          <p className="mb-6">
            Además del Contenido, las marcas, denominativas o figurativas, marcas de servicio, diseños industriales y cualquier otro elemento de propiedad intelectual que haga parte del Contenido (la &quot;Propiedad Industrial&quot;), son de propiedad de PLATAFORMA DE QUEJAS CIUDADANA SAS o de sus proveedores y, por tal razón, no pueden ser usadas por los Usuarios en conexión con cualquier producto o servicio que no sea provisto por QUEJATE.COM.CO. En el mismo sentido, la Propiedad Industrial no podrá ser usada por los Usuarios en conexión con cualquier producto y servicio que no sea de aquellos que comercializa u ofrece QUEJATE.COM.CO o de forma que impliquen actos de confusión, descrédito a la Empresa o a las Empresas Proveedoras o cualquier acto de competencia desleal.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.6. Uso De Información Y Privacidad</h3>
          <p className="mb-6">
            Con la descarga de la APP o el uso de La Plataforma usted acepta y autoriza que PLATAFORMA DE QUEJAS CIUDADANA SAS y QUEJATE.COM.CO utilicen sus datos en calidad de responsable del tratamiento para fines derivados de la ejecución de La Plataforma de acuerdo con la política de tratamiento de datos personales disponible en https://www.quejate.com.co/legal
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.7. Declaración de Responsabilidad</h3>
          <p className="mb-4">
            Procuraremos garantizar la disponibilidad, continuidad y buen funcionamiento de La Plataforma. Sin embargo, podremos bloquear, interrumpir o restringir el acceso a esta cuando lo considere necesario para el mejoramiento de la aplicación o por dar de baja de la misma.
          </p>
          <p className="mb-4">
            Se recomienda al Usuario tomar medidas adecuadas y actuar diligentemente al momento de acceder a la aplicación, como, por ejemplo, contar con programas de protección, antivirus, para manejo de malware, spyware y herramientas similares.
          </p>
          <p className="mb-4">
            PLATAFORMA DE QUEJAS CIUDADANA SAS actúa como intermediario tecnológico y no asume responsabilidad por:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-6">
            <li>La viabilidad de las tutelas generadas por IA.</li>
            <li>La respuesta o falta de respuesta de las entidades públicas a las PQRSD.</li>
            <li>Por errores en la digitación, accesos o el contenido ingresado por parte del Usuario.</li>
            <li>Las actuaciones de los Profesionales en Derecho registrados, quienes actúan bajo su propia responsabilidad.</li>
            <li>Eventos de fuerza mayor o caso fortuito;</li>
            <li>Por la pérdida, extravío o hurto de su dispositivo móvil o de computación que implique el acceso de terceros a la aplicación móvil;</li>
            <li>Por los perjuicios, lucro cesante, daño emergente, morales, o sumas a cargo de proveedores, profesionales del derecho o aliados por los retrasos, no procesamiento de información o suspensión del servicio de QUEJATE.COM.CO en un móvil o daños en los dispositivos móviles.</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.8. Denegación y Retirada del Acceso a la Aplicación</h3>
          <p className="mb-6">
            En el evento en que un Usuario incumpla estos Términos y Condiciones, o cualesquiera otras disposiciones que resulten de aplicación, PLATAFORMA DE QUEJAS CIUDADANA SAS y La Plataforma QUEJATE.COM.CO podrán suspender temporal o definitivamente su acceso a la aplicación.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.9. Uso de Información No Personal</h3>
          <p className="mb-4">
            La información personal suministrada por el Usuario al momento de su registro en el sitio, incluye datos tales como: nombre, identificación, edad, género, dirección, correo electrónico y teléfono, por lo tanto, los Usuarios asumen cualquier riesgo derivado de entregarlo en un medio electrónico como lo es el Internet, el cual no está exento de fallas técnicas, virus, software malicioso, ataques de terceros, entre otros.
          </p>
          <p className="mb-6">
            La información personal de todos los Usuarios estará protegida por una clave asignada por el mismo Usuario de manera libre y voluntaria, con la cual podrá contar con el acceso a la Plataforma. Cualquier Usuario accederá a la página mediante el ingreso de su nombre de Usuario y su contraseña personal.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Seguridad</h2>
          <p className="mb-4">
            La PLATAFORMA DE QUEJAS CIUDADANA SAS está comprometida en la protección de la seguridad de su información personal. No obstante, tenemos implementados mecanismos razonables de seguridad que aseguran la protección de la información personal, así como los accesos únicamente al personal y sistemas autorizados, también contra la pérdida, uso indebido y alteración de sus datos de usuario bajo nuestro control.
          </p>
          <p className="mb-4">
            Sólo personal autorizado tiene acceso a la información que nos proporciona. Además, hemos impuesto reglas estrictas a los empleados de PLATAFORMA DE QUEJAS CIUDADANA SAS con acceso a las bases de datos que almacenan información del usuario o a los servidores que hospedan nuestros servicios.
          </p>
          <p className="mb-4">
            Tenemos en marcha medidas técnicas y de seguridad para evitar el acceso no autorizado o ilegal o la pérdida accidental, destrucción u ocurrencia de daños a su información. Cuando se recogen datos a través de La Plataforma, recogemos sus datos personales en un servidor seguro. Nosotros usamos programas de protección en nuestros servidores. Cuando recopilamos información de tarjetas de pago electrónico, se utilizan sistemas de cifrado Secure Socket Layer (SSL) que codifica la misma evitando usos fraudulentos. Si bien no es posible garantizar la consecución de un resultado, estos sistemas han probado ser efectivos en el manejo de información reservada toda vez que cuentan con mecanismos que impiden el acceso de amenazas externas (por ejemplo, hackers). La plataforma de procesamiento de pagos es de un tercero experto en la prestación de tales servicios y es responsable de recopilar la información financiera de los Usuarios y se asegura de la realización del proceso de pago de principio a fin. Por tanto, el éxito de tal proceso es exclusiva responsabilidad de tal entidad o grupo de entidades.
          </p>
          <p className="mb-6">
            Mantenemos las salvaguardias físicas, electrónicas y de procedimiento en relación con la recolección, almacenamiento y divulgación de su información. Nuestros procedimientos de seguridad exigen que en ocasiones podremos solicitarle una prueba de identidad antes de revelar información personal. Tenga en cuenta que el Usuario es el único responsable de la protección contra el acceso no autorizado a su contraseña y a su computadora.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.1. Uso de Direcciones IP</h3>
          <p className="mb-6">
            PLATAFORMA DE QUEJAS CIUDADANA SAS y La Plataforma QUEJATE.COM.CO podrán recolectar direcciones IP para propósitos de administración de sistemas y para auditar el uso de nuestro sitio, todo lo anterior de acuerdo con la autorización de protección de datos que se suscriba para tal efecto. Normalmente no vinculamos la dirección IP de un usuario con la información personal de ese usuario, lo que significa que cada sesión de usuario se registra, pero el usuario sigue siendo anónimo para nosotros. Sin embargo, podemos usar las direcciones IP para identificar a los usuarios de nuestro sitio cuando sea necesario con el objeto de exigir el cumplimiento de los términos de uso del sitio, o para proteger nuestro servicio, sitio u otros usuarios.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.2. Propiedad y Administración del Sitio Web</h3>
          <div className="mb-6">
            <p className="mb-2">La plataforma es propiedad y es administrado por:</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>PLATAFORMA DE QUEJAS CIUDADANA SAS</strong></p>
              <p>NIT 9019694208</p>
              <p>Dirección: CALLE 29 I1#21E-17</p>
              <p>Ciudad, País: SANTA MARTA, COLOMBIA</p>
              <p>Teléfono: 3015106757</p>
              <p>Correo electrónico: soporte@quejate.com.co</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Normas Finales</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1. Jurisdicción</h3>
          <p className="mb-6">
            Estos T&C y todo lo que tenga que ver con esta aplicación, se rigen por la legislación de la República de Colombia. En consecuencia, todas las visitas y todos los contratos y transacciones que se realicen en La Plataforma, así como sus efectos jurídicos, quedarán regidos por estas reglas y sometidos a las leyes colombianas. En caso de que Usuarios de otros países utilicen La Plataforma para solicitar productos y servicios en Colombia se sujetan completamente a lo dispuesto en los presentes términos. La jurisdicción competente será la de los jueces de la ciudad de Santa Marta, salvo pacto en contrario.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2. Mecanismo de Resolución de Conflictos</h3>
          <p className="mb-6">
            Toda controversia derivada de la relación entre el Usuario y la Plataforma, o entre Usuarios, se someterá de manera obligatoria a una audiencia de conciliación extrajudicial en derecho antes de iniciar cualquier acción judicial, conforme a la Ley 640 de 2001.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3. Modificaciones de este Acuerdo</h3>
          <p className="mb-6">
            PLATAFORMA DE QUEJAS CIUDADANA SAS podrá modificar los Términos y Condiciones Generales en cualquier momento, haciendo públicos en La Plataforma los términos modificados y enviándolos a través de los correos electrónicos registrados por cada usuario. Todos los términos modificados entrarán en vigor a los 10 (diez) días de su publicación. Dentro de los 5 (cinco) días siguientes a la publicación de las modificaciones introducidas, el Usuario deberá contactarnos, si no acepta las mismas; en ese caso quedará disuelto el vínculo contractual y será inhabilitado como Miembro perdiendo el acceso a la web y app. Vencido este plazo, se considerará que el Usuario acepta los nuevos términos y el contrato continuará vinculando a ambas partes. En todo caso, el mero uso de la web o alguna de las apps implica para el usuario la aceptación de la modificación de los términos.
          </p>
        </div>
      </div>
    </div>
  );
}
