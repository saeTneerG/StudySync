import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, AlertCircle, Plus, Clock } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { sharedStyles } from '../constants/sharedStyles';
import { DataContext } from '../context/DataContext';
import { useNavigation } from '@react-navigation/native';
import { getNextClass, getUpcomingExams } from '../utils/dashboardHelpers';
import ScreenHeader from '../components/ScreenHeader';

export default function DashboardScreen() {
    const { courses } = useContext(DataContext);
    const navigation = useNavigation();

    const nextClass = useMemo(() => getNextClass(courses), [courses]);
    const upcomingExams = useMemo(() => getUpcomingExams(courses), [courses]);
    //ควย
    return (
        <SafeAreaView style={sharedStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ScreenHeader />

                <View style={styles.contentContainer}>
                    <Text style={sharedStyles.sectionTitle}>Dashboard</Text>
                    <Text style={styles.sectionSubtitle}>ภาพรวมกิจกรรมของคุณ</Text>

                    <View style={[styles.card, styles.shadow]}>
                        <View style={styles.cardHeader}>
                            <Clock size={20} color={COLORS.primary} />
                            <Text style={styles.cardTitle}>Next Class</Text>
                        </View>
                        {nextClass ? (
                            <View style={styles.nextClassWrapper}>
                                <View style={styles.nextClassTimeRow}>
                                    <View style={styles.nextClassDayBadge}>
                                        <Text style={styles.nextClassDayText}>{nextClass.day}</Text>
                                    </View>
                                    <Text style={styles.nextClassTime}>
                                        {new Date(nextClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(nextClass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </Text>
                                </View>
                                <Text style={styles.nextClassName}>{nextClass.subjectCode} {nextClass.subjectName}</Text>
                                <Text style={styles.nextClassRoom}>ห้อง: {nextClass.room}</Text>
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <BookOpen size={48} color="#E0E0E0" />
                                <Text style={styles.emptyStateText}>ไม่มีคาบเรียนถัดไป</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Time Table')}>
                                    <Text style={styles.linkText}>เพิ่มตารางเรียน</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={[styles.card, styles.shadow]}>
                        <View style={styles.cardHeader}>
                            <AlertCircle size={20} color={COLORS.danger} />
                            <Text style={styles.cardTitle}>Upcoming Exams <Text style={styles.subText}>(7 วัน)</Text></Text>
                        </View>
                        {upcomingExams.length > 0 ? (
                            <View style={styles.upcomingExamsList}>
                                {upcomingExams.map((exam, index) => (
                                    <View key={exam.id || index} style={[styles.examItem, index === upcomingExams.length - 1 && { borderBottomWidth: 0 }]}>
                                        <View style={styles.examDateBadge}>
                                            <Text style={styles.examDateText}>
                                                {new Date(exam.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                            </Text>
                                        </View>
                                        <View style={styles.examDetails}>
                                            <Text style={styles.examSubject} numberOfLines={1}>
                                                {exam.subjectCode} {exam.subjectName}
                                            </Text>
                                            <Text style={styles.examTimeRoom}>
                                                {new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(exam.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} | ห้อง: {exam.room}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <AlertCircle size={48} color="#E0E0E0" />
                                <Text style={styles.emptyStateText}>ไม่มีการสอบที่ใกล้จะถึง</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 20,
    },
    contentContainer: {
        padding: 20,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 20,
        marginTop: 4,
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
        ...COLORS.cardShadow,
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
        color: COLORS.primary,
    },
    nextClassWrapper: {
        paddingVertical: 5,
    },
    nextClassTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nextClassDayBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginRight: 10,
    },
    nextClassDayText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    nextClassTime: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: 'bold',
    },
    nextClassName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    nextClassRoom: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    upcomingExamsList: {
        marginTop: 5,
    },
    examItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    examDateBadge: {
        backgroundColor: COLORS.danger + '20',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 55,
    },
    examDateText: {
        color: COLORS.danger,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    examDetails: {
        flex: 1,
    },
    examSubject: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    examTimeRoom: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    actionButton: {
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
