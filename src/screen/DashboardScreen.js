import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, AlertCircle, Plus, Clock } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { sharedStyles } from '../constants/sharedStyles';
import { DataContext } from '../context/DataContext';
import { useNavigation } from '@react-navigation/native';
import { getAllClasses, getAllExams, getNextClass, getUpcomingExams } from '../utils/dashboardHelpers';
import ScreenHeader from '../components/ScreenHeader';
import AddActivityModal from '../components/AddActivityModal';

const getShortDay = (dayStr) => {
    const map = {
        'อาทิตย์': 'อา.', 'จันทร์': 'จ.', 'อังคาร': 'อ.', 'พุธ': 'พ.', 'พฤหัสบดี': 'พฤ.', 'ศุกร์': 'ศ.', 'เสาร์': 'ส.'
    };
    return map[dayStr] || dayStr;
};

export default function DashboardScreen() {
    const { courses, addActivity } = useContext(DataContext);
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);

    const handleAddActivity = async (newActivity) => {
        try {
            await addActivity(newActivity);
            setModalVisible(false);
        } catch (e) { /* handled in DataContext */ }
    };

    const FILTERS = useMemo(() => [
        { id: 'all', label: 'ทั้งหมด' },
        { id: 'classes', label: 'ตารางเรียน' },
        { id: 'exams', label: 'วันสอบ' }
    ], []);

    const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

    const nextClass = useMemo(() => getNextClass(courses), [courses]);
    const upcomingExams = useMemo(() => getUpcomingExams(courses), [courses]);
    const allClasses = useMemo(() => getAllClasses(courses), [courses]);
    const allExams = useMemo(() => getAllExams(courses), [courses]);
    return (
        <SafeAreaView style={sharedStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ScreenHeader />

                <View style={styles.contentContainer}>
                    <Text style={sharedStyles.sectionTitle}>Dashboard</Text>
                    <Text style={styles.sectionSubtitle}>ภาพรวมกิจกรรมของคุณ</Text>

                    {/* Filters */}
                    <View style={styles.filterContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterContent}
                        >
                            {FILTERS.map((filter) => {
                                const isSelected = selectedFilter.id === filter.id;
                                return (
                                    <TouchableOpacity
                                        key={filter.id}
                                        style={[
                                            styles.filterPill,
                                            isSelected && styles.filterPillActive
                                        ]}
                                        onPress={() => setSelectedFilter(filter)}
                                    >
                                        <Text style={[
                                            styles.filterPillText,
                                            isSelected && styles.filterPillTextActive
                                        ]}>
                                            {filter.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {selectedFilter.id === 'all' && (
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
                    )}

                    {selectedFilter.id === 'classes' && (
                        <View style={[styles.card, styles.shadow]}>
                            <View style={styles.cardHeader}>
                                <Clock size={20} color={COLORS.primary} />
                                <Text style={styles.cardTitle}>ตารางเรียนทั้งหมด</Text>
                            </View>
                            {allClasses.length > 0 ? (
                                <View style={styles.upcomingExamsList}>
                                    {allClasses.map((cls, index) => (
                                        <View key={`${cls.id}-${index}-${cls.dayIndex}`} style={[styles.examItem, index === allClasses.length - 1 && { borderBottomWidth: 0 }]}>
                                            <View style={styles.examDateBadge}>
                                                <Text style={styles.examDateText}>
                                                    {getShortDay(cls.day)}
                                                </Text>
                                            </View>
                                            <View style={styles.examDetails}>
                                                <Text style={styles.examSubject} numberOfLines={1}>
                                                    {cls.subjectCode} {cls.subjectName}
                                                </Text>
                                                <Text style={styles.examTimeRoom}>
                                                    {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} | ห้อง: {cls.room}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyState}>
                                    <BookOpen size={48} color="#E0E0E0" />
                                    <Text style={styles.emptyStateText}>ไม่มีคาบเรียน</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Time Table')}>
                                        <Text style={styles.linkText}>เพิ่มตารางเรียน</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {selectedFilter.id === 'all' && (
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
                    )}

                    {selectedFilter.id === 'exams' && (
                        <View style={[styles.card, styles.shadow]}>
                            <View style={styles.cardHeader}>
                                <AlertCircle size={20} color={COLORS.danger} />
                                <Text style={styles.cardTitle}>ตารางสอบทั้งหมด</Text>
                            </View>
                            {allExams.length > 0 ? (
                                <View style={styles.upcomingExamsList}>
                                    {allExams.map((exam, index) => (
                                        <View key={exam.id || index} style={[styles.examItem, index === allExams.length - 1 && { borderBottomWidth: 0 }]}>
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
                                    <Text style={styles.emptyStateText}>ไม่มีการสอบ</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.quickAddBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Plus size={20} color={COLORS.white} />
                        <Text style={styles.quickAddBtnText}>Quick Add Activity / Task</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <AddActivityModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAddActivity={handleAddActivity}
                courses={courses}
            />
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
        marginBottom: 15,
        marginTop: 4,
    },
    filterContainer: {
        marginHorizontal: -20,
        marginBottom: 20,
    },
    filterContent: {
        paddingHorizontal: 20,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 10,
    },
    filterPillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterPillText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '500',
    },
    filterPillTextActive: {
        color: COLORS.white,
        fontWeight: 'bold',
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
    quickAddBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
        ...COLORS.cardShadow,
    },
    quickAddBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
