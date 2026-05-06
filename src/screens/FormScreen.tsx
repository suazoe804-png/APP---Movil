import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { createSolicitud, getSolicitudById, updateSolicitud } from '../services/solicitudesService';
import { Picker } from '@react-native-picker/picker';

const AREAS = [
  'Administración',
  'Recursos Humanos',
  'Ventas',
  'Mercadotecnia',
  'Sistemas',
  'Soporte Técnico',
  'Contabilidad',
  'Finanzas',
  'Dirección',
  'Operaciones',
  'Otro'
];

const TIPOS_PROBLEMA = [
  'Equipo de cómputo (Hardware)',
  'Falla de Software',
  'Red / Internet',
  'Impresoras / Copiadoras',
  'Telefonía',
  'Mantenimiento / Mobiliario',
  'Otro'
];

import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Form'>;
  route: RouteProp<RootStackParamList, 'Form'>;
};

export default function FormScreen({ navigation, route }: Props) {
  const idValue = route.params?.id;
  const isEditing = !!idValue;

  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [tipoProblema, setTipoProblema] = useState(TIPOS_PROBLEMA[0]);
  const [descripcion, setDescripcion] = useState('');
  const [estatus, setEstatus] = useState<'Pendiente' | 'En proceso' | 'Atendido' | 'Cancelado'>('Pendiente');
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    if (isEditing && idValue) {
      loadSolicitud(idValue);
    }
  }, [isEditing, idValue]);

  const loadSolicitud = async (id: string) => {
    try {
      const data = await getSolicitudById(id);
      if (data) {
        setNombre(data.nombre);
        setArea(data.area);
        setTipoProblema(data.tipoProblema);
        setDescripcion(data.descripcion);
        setEstatus(data.estatus);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const validate = () => {
    if (!nombre.trim()) return 'El nombre es obligatorio.';
    if (!descripcion.trim() || descripcion.length < 10) return 'La descripción es obligatoria y debe tener al menos 10 caracteres.';
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Error de validación', error);
      return;
    }

    setLoading(true);
    try {
      if (isEditing && idValue) {
        await updateSolicitud(idValue, {
          nombre,
          area,
          tipoProblema,
          descripcion,
          estatus
        });
        Alert.alert('Éxito', 'Solicitud actualizada correctamente');
      } else {
        const payload = {
          nombre,
          area,
          tipoProblema,
          descripcion,
          estatus: 'Pendiente' as const
        };
        await createSolicitud(payload);
        Alert.alert('Éxito', 'Solicitud registrada correctamente');
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', 'No se pudo guardar la solicitud:\n' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <SafeAreaView style={styles.center} edges={['bottom', 'left', 'right']}><ActivityIndicator size="large" color="#1E40AF" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nombre Completo</Text>
      <TextInput 
        style={styles.input} 
        value={nombre} 
        onChangeText={setNombre} 
        placeholder="Ej. Juan Pérez"
      />

      <Text style={styles.label}>Área</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={area}
          style={styles.picker}
          onValueChange={(itemValue: string) => setArea(itemValue)}
        >
          {AREAS.map((a) => (
            <Picker.Item label={a} value={a} key={a} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de Problema</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoProblema}
          style={styles.picker}
          onValueChange={(itemValue: string) => setTipoProblema(itemValue)}
        >
          {TIPOS_PROBLEMA.map((t) => (
            <Picker.Item label={t} value={t} key={t} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Descripción</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={descripcion} 
        onChangeText={setDescripcion} 
        multiline
        numberOfLines={4}
        placeholder="Detalle el problema con la mayor claridad posible"
      />

      <TouchableOpacity 
        style={[styles.btn, loading && styles.btnDisabled]} 
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.btnText}>{loading ? 'GUARDANDO...' : (isEditing ? 'ACTUALIZAR SOLICITUD' : 'GUARDAR SOLICITUD')}</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 24,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    backgroundColor: '#FFF',
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 54,
    width: '100%',
    color: '#1E293B',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#1E40AF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
