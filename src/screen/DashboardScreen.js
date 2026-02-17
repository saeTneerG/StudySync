import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, AlertCircle, Plus, Clock } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export default function DashboardScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appName}>StudeySync</Text>
                    <Text style={styles.greeting}>สวัสดี สมชาย ใจดี</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <Text style={styles.sectionSubtitle}>ภาพรวมกิจกรรมของคุณ</Text>

                    {/* Next Class Card */}
                    <View style={[styles.card, styles.shadow]}>
                        <View style={styles.cardHeader}>
                            <Clock size={20} color={COLORS.primary} />
                            <Text style={styles.cardTitle}>Next Class</Text>
                        </View>
                        <View style={styles.emptyState}>
                            <BookOpen size={48} color="#E0E0E0" />
                            <Text style={styles.emptyStateText}>ไม่มีคาบเรียนถัดไป</Text>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>เพิ่มตารางเรียน</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Upcoming Exams Card */}
                    <View style={[styles.card, styles.shadow]}>
                        <View style={styles.cardHeader}>
                            <AlertCircle size={20} color={COLORS.danger} />
                            <Text style={styles.cardTitle}>Upcoming Exams <Text style={styles.subText}>(7 วัน)</Text></Text>
                        </View>
                        <View style={styles.emptyState}>
                            <AlertCircle size={48} color="#E0E0E0" />
                            <Text style={styles.emptyStateText}>ไม่มีการสอบที่ใกล้จะถึง</Text>
                        </View>
                    </View>

                    {/* Quick Add Button */}
                    <TouchableOpacity style={[styles.actionButton, styles.shadow]}>
                        <Plus color={COLORS.white} size={24} />
                        <Text style={styles.actionButtonText}>Quick Add Activity / Task</Text>
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
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.white,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary, // Chula Pink
        marginBottom: 4,
    },
    greeting: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
    },
    contentContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 10,
    },
    subText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: 'normal',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyStateText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    linkText: {
        marginTop: 5,
        fontSize: 14,
        color: COLORS.primary, // Chula Pink
        textDecorationLine: 'none',
    },
    actionButton: {
        backgroundColor: '#3B82F6', // The blue from the image, but maybe we should use primary?
        // User requested Chula Theme. I should use primary (Pink) for the main action button.
        // However, the image shows Blue. "ด้วยสีธีมสีของมหาลัยจุฬา".
        // I will use `COLORS.primary` (Pink) to follow the instruction strictly.
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});
