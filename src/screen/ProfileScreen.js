import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Building2, GraduationCap, Trash2 } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export default function ProfileScreen() {
    const [name, setName] = useState('สมชาย ใจดี');
    const [faculty, setFaculty] = useState('วิศวกรรมศาสตร์');
    const [year, setYear] = useState('เลือกชั้นปี');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.appName}>StudeySync</Text>
                <Text style={styles.greeting}>สวัสดี สมชาย ใจดี</Text>
            </View>
            <View style={styles.divider} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <Text style={styles.pageTitle}>Profile & Settings</Text>
                    <Text style={styles.pageSubtitle}>จัดการข้อมูลส่วนตัว</Text>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>บัญชีผู้ใช้</Text>
                        <View style={[styles.card, styles.shadow]}>
                            <View style={styles.userInfoRow}>
                                <View style={styles.avatarContainer}>
                                    <User size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.userInfoText}>
                                    <Text style={styles.userLabel}>ชื่อผู้ใช้</Text>
                                    <Text style={styles.userName}>Somchai</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.logoutButton}>
                                <LogOut size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                                <Text style={styles.logoutText}>ออกจากระบบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>ข้อมูลผู้เรียน</Text>
                        <View style={[styles.card, styles.shadow]}>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <User size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>ชื่อ-นามสกุล</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="เช่น สมชาย ใจดี"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <Building2 size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>คณะ/สาขา</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={faculty}
                                    onChangeText={setFaculty}
                                    placeholder="เช่น วิศวกรรมศาสตร์"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <GraduationCap size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>ชั้นปี</Text>
                                </View>
                                <TouchableOpacity style={styles.dropdown}>
                                    <Text style={styles.dropdownText}>{year}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity style={[styles.button, styles.saveButton]}>
                                    <Text style={styles.saveButtonText}>บันทึก</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]}>
                                    <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    <TouchableOpacity style={styles.deleteButton}>
                        <Trash2 size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                        <Text style={styles.deleteButtonText}>ลบข้อมูล</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.white,
        paddingBottom: 10,
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    contentContainer: {
        padding: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    shadow: {
        shadowColor: COLORS.cardShadow.shadowColor,
        shadowOffset: COLORS.cardShadow.shadowOffset,
        shadowOpacity: COLORS.cardShadow.shadowOpacity,
        shadowRadius: COLORS.cardShadow.shadowRadius,
        elevation: COLORS.cardShadow.elevation,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD', // Blue tint from original design, maybe adjust to pink tint?
        // Let's use Secondary (Light Pink) #F8D7DA
        backgroundColor: 'rgba(222, 86, 118, 0.1)', // Primary with opacity
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    userInfoText: {
        flex: 1,
    },
    userLabel: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 16,
        color: COLORS.text,
    },
    logoutButton: {
        backgroundColor: '#4A4A4A', // Dark Grey
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: COLORS.text,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        marginRight: 10,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: COLORS.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12, // Match card radius or button radius? Let's use 12 to match cards or 10
        borderRadius: 10,
        marginTop: 20,
    },
    deleteButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
