import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Solicitud } from '../types';
import { getSolicitudes } from '../services/solicitudesService';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'List'>;
};

export default function ListScreen({ navigation }: Props) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await getSolicitudes();
      if (data) {
        setSolicitudes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSolicitudes();
    }, [])
  );

  const getBadgeStyle = (estatus: string) => {
    switch (estatus) {
      case 'Pendiente': return styles.badgePendiente;
      case 'En proceso': return styles.badgeProceso;
      case 'Atendido': return styles.badgeAtendido;
      case 'Cancelado': return styles.badgeCancelado;
      default: return styles.badgeDefault;
    }
  };

  const getBadgeText = (estatus: string) => {
    switch (estatus) {
      case 'Pendiente': return styles.textPendiente;
      case 'En proceso': return styles.textProceso;
      case 'Atendido': return styles.textAtendido;
      case 'Cancelado': return styles.textCancelado;
      default: return styles.textDefault;
    }
  };

  const renderItem = ({ item }: { item: Solicitud }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <View style={[styles.badge, getBadgeStyle(item.estatus)]}>
          <Text style={[styles.badgeText, getBadgeText(item.estatus)]}>{item.estatus}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.tipoProblema}</Text>
      <Text style={styles.cardDate}>Creado: {new Date(item.fechaCreacion).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {loading ? (
        <ActivityIndicator size="large" color="#1E40AF" style={{ marginTop: 50 }} />
      ) : solicitudes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay solicitudes registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  badgePendiente: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1 },
  textPendiente: { color: '#DC2626' },
  badgeProceso: { backgroundColor: '#FEF9C3', borderColor: '#FDE047', borderWidth: 1 },
  textProceso: { color: '#CA8A04' },
  badgeAtendido: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC', borderWidth: 1 },
  textAtendido: { color: '#16A34A' },
  badgeCancelado: { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', borderWidth: 1 },
  textCancelado: { color: '#4B5563' },
  badgeDefault: { backgroundColor: '#E2E8F0', borderColor: '#CBD5E1', borderWidth: 1 },
  textDefault: { color: '#475569' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
  }
});
