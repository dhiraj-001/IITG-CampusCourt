import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* User Card */}
        <LinearGradient
          colors={['#1E2130', '#131525']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.avatarGradient}>
            <Text style={styles.avatarText}>DJ</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Dhiraj Jha</Text>
            <Text style={styles.userPhone}>+91 98765 43210</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color="#A78BFA" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Settings Links */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#7C3AED20' }]}>
              <Ionicons name="notifications-outline" size={20} color="#A78BFA" />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#38405E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#14B8A620' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#14B8A6" />
            </View>
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#38405E" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#F43F5E20' }]}>
              <Ionicons name="log-out-outline" size={20} color="#F43F5E" />
            </View>
            <Text style={[styles.settingText, { color: '#F43F5E' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E1A' },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    color: '#EAEFFF',
    fontSize: 28,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: -0.5,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#38405E',
    marginBottom: 32,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#EAEFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    marginBottom: 4,
  },
  userPhone: {
    color: '#8FA3C0',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E2130',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38405E',
  },
  
  settingsSection: {
    gap: 16,
  },
  sectionTitle: {
    color: '#6B7FA0',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181B2E',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    color: '#EAEFFF',
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
});
