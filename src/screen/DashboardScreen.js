import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, AlertCircle, Plus, Clock } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const getNextClass = (courses) => {
    if (!courses || courses.length === 0) return null;

    const dayMap = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let upcomingClasses = [];

    courses.forEach(course => {
        if (!course.startTime || !course.endTime) return;
        const courseDate = new Date(course.startTime);
        const startMinutes = courseDate.getHours() * 60 + courseDate.getMinutes();

        const endDate = new Date(course.endTime);
        const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

        const courseDayIndex = dayMap.indexOf(course.day);

        let daysAhead = (courseDayIndex - currentDayIndex + 7) % 7;

        if (daysAhead === 0 && endMinutes <= currentMinutes) {
            daysAhead = 7;
        }

        const exactTimeAheadMinutes = daysAhead * 24 * 60 + startMinutes - currentMinutes;

        upcomingClasses.push({
            ...course,
            exactTimeAheadMinutes,
        });
    });

    upcomingClasses.sort((a, b) => a.exactTimeAheadMinutes - b.exactTimeAheadMinutes);

    return upcomingClasses[0] || null;
};

export default function DashboardScreen() {
    const { userInfo } = useContext(AuthContext);
    const [nextClass, setNextClass] = useState(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const fetchNextClass = async () => {
        if (!userInfo) return;
        try {
            const key = `@courses_${userInfo.email}`;
            const storedCourses = await AsyncStorage.getItem(key);
            if (storedCourses) {
                const courses = JSON.parse(storedCourses);
                const next = getNextClass(courses);
                setNextClass(next);
            } else {
                setNextClass(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchNextClass();
        }
    }, [isFocused, userInfo]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appName}>StudeySync</Text>
                    <Text style={styles.greeting}>สวัสดี {userInfo?.name}</Text>
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
    nextClassWrapper: {
        paddingTop: 5,
        paddingBottom: 5,
    },
    nextClassTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nextClassDayBadge: {
        backgroundColor: COLORS.primary + '20', // transparent primary
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
