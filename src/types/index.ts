export interface Solicitud {
  id: string;
  nombre: string;
  area: string;
  tipoProblema: string;
  descripcion: string;
  estatus: 'Pendiente' | 'En proceso' | 'Atendido' | 'Cancelado';
  fechaCreacion: number;
  fechaActualizacion: number;
  userId: string;
}

export type RootStackParamList = {
  Home: undefined;
  Form: { id?: string };
  List: undefined;
  Detail: { id: string };
  Help: undefined;
};
