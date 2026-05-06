import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ayuda y soporte</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Correo Institucional</Text>
        <Text style={styles.value}>soporte.ti@empresa.com</Text>

        <Text style={styles.label}>Teléfono de Contacto</Text>
        <Text style={styles.value}>55 1234 5678</Text>

        <Text style={styles.label}>Horario de Atención</Text>
        <Text style={styles.value}>Lunes a viernes de 09:00 a 18:00 h</Text>
      </View>

      <Text style={styles.helpText}>
        Para incidencias críticas fuera del horario de atención, comuníquese con el coordinador de guardia.
      </Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  }
});
