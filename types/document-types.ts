export enum DocumentType {
  CC = "CC",
  CE = "CE",
  PPT = "PPT",
  NIT = "NIT"
}

export const DocumentTypeMapping = {
  [DocumentType.CC]: {
    code: "1",
    label: "Cédula de Ciudadanía"
  },
  [DocumentType.CE]: {
    code: "2",
    label: "Cédula de Extranjería"
  },
  [DocumentType.PPT]: {
    code: "4",
    label: "Permiso por Protección Temporal"
  },
  [DocumentType.NIT]: {
    code: "3",
    label: "NIT"
  }
};
