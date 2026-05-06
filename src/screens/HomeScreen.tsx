import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>🏠 HelpDesk TI</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="monitor-shimmer" size={40} color="#1E40AF" />
          </View>
          <Text style={styles.title}>Mesa de Ayuda</Text>
          <Text style={styles.subtitle}>Soporte Técnico Especializado</Text>
        </View>

        <View style={styles.content}>
        <TouchableOpacity 
          style={styles.cardPrimary} 
          onPress={() => navigation.navigate('Form', {})}
          activeOpacity={0.8}
        >
          <View style={styles.cardIconPrimary}>
            <Ionicons name="add-circle" size={32} color="#1E40AF" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitlePrimary}>Nuevo Ticket</Text>
            <Text style={styles.cardSubtitlePrimary}>Reportar una incidencia</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.cardSecondary} 
            onPress={() => navigation.navigate('List')}
            activeOpacity={0.8}
          >
            <Ionicons name="list" size={32} color="#1E40AF" />
            <Text style={styles.cardTitle}>Mis Solicitudes</Text>
            <Text style={styles.cardSubtitle}>Seguimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cardSecondary} 
            onPress={() => navigation.navigate('Help')}
            activeOpacity={0.8}
          >
            <Ionicons name="help-buoy" size={32} color="#047857" />
            <Text style={styles.cardTitle}>Ayuda</Text>
            <Text style={styles.cardSubtitle}>Directorio y FAQs</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    padding: 24,
    marginTop: 8,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  cardPrimary: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardIconPrimary: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitlePrimary: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitlePrimary: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  cardSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
