import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Solicitud } from '../types';
import { getSolicitudById, deleteSolicitud, updateSolicitud } from '../services/solicitudesService';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const STATUS_COLORES = {
  'Pendiente': { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626' },
  'En proceso': { bg: '#FEF9C3', border: '#FDE047', text: '#CA8A04' },
  'Atendido': { bg: '#DCFCE7', border: '#86EFAC', text: '#16A34A' },
  'Cancelado': { bg: '#F3F4F6', border: '#D1D5DB', text: '#4B5563' },
};

export default function DetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSolicitudById(id);
      setSolicitud(data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Solicitud['estatus']) => {
    if (!solicitud || solicitud.estatus === newStatus) return;
    setUpdatingStatus(true);
    try {
      await updateSolicitud(id, { estatus: newStatus });
      setSolicitud({ ...solicitud, estatus: newStatus });
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo actualizar el estatus: ' + e.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar',
      '¿Está seguro de eliminar este ticket?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSolicitud(id);
              navigation.navigate('List');
            } catch (e: any) {
              Alert.alert('Error', 'No se pudo eliminar: ' + e.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <SafeAreaView style={styles.center} edges={['bottom', 'left', 'right']}><ActivityIndicator size="large" color="#1E40AF" /></SafeAreaView>;
  }

  if (!solicitud) {
    return (
      <SafeAreaView style={styles.center} edges={['bottom', 'left', 'right']}>
        <Text>No se encontró la solicitud.</Text>
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLORES[solicitud.estatus] || STATUS_COLORES['Pendiente'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.statusBox, { backgroundColor: statusColor.bg, borderColor: statusColor.border }]}>
        <Text style={styles.label}>ESTATUS ACTUAL</Text>
        <Text style={[styles.statusValue, { color: statusColor.text }]}>{solicitud.estatus.toUpperCase()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Actualizar Estatus</Text>
      <View style={styles.statusOptions}>
        {(['Pendiente', 'En proceso', 'Atendido', 'Cancelado'] as Array<Solicitud['estatus']>).map((st) => (
          <TouchableOpacity 
            key={st}
            disabled={updatingStatus || solicitud.estatus === st}
            style={[
              styles.statusBtn,
              solicitud.estatus === st ? { backgroundColor: STATUS_COLORES[st].bg, borderColor: STATUS_COLORES[st].border } : {}
            ]}
            onPress={() => handleUpdateStatus(st)}
          >
            <Text style={[
              styles.statusBtnText,
              solicitud.estatus === st ? { color: STATUS_COLORES[st].text, fontWeight: 'bold' } : {}
            ]}>{st}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {updatingStatus && <ActivityIndicator style={{marginTop: 8}} color="#1E40AF" />}

      <Text style={styles.label}>Solicitante</Text>
      <Text style={styles.value}>{solicitud.nombre} ({solicitud.area})</Text>

      <Text style={styles.label}>Problema</Text>
      <Text style={styles.value}>{solicitud.tipoProblema}</Text>

      <Text style={styles.label}>Descripción</Text>
      <Text style={styles.value}>{solicitud.descripcion}</Text>

      <Text style={styles.label}>Fecha</Text>
      <Text style={styles.value}>{new Date(solicitud.fechaActualizacion).toLocaleString()}</Text>

      <View style={{ marginTop: 32 }}>
        <Text style={styles.sectionTitle}>Acciones de Gestión</Text>
        <TouchableOpacity 
          style={[styles.btn, styles.btnOutline]} 
          onPress={() => navigation.navigate('Form', { id: solicitud.id })}
        >
          <Text style={styles.btnOutlineText}>EDITAR DATOS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, styles.btnDanger]} 
          onPress={handleDelete}
        >
          <Text style={styles.btnDangerText}>ELIMINAR TICKET</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.idText}>ID: {solicitud.id}</Text>
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
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC'},
  statusBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase'
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  statusBtnText: {
    fontSize: 12,
    color: '#475569',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 4,
    marginTop: 12,
    textTransform: 'uppercase'
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  value: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  btn: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnOutlineText: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnDanger: {
    backgroundColor: '#EF4444',
  },
  btnDangerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  idText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 'auto',
    paddingTop: 30,
  }
});
