import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { Trash2 } from 'lucide-react-native';

export default function ScheduleTab({ courses, dayOptions, setModalVisible, onDeleteCourse }) {
    const renderScheduleCards = () => {
        const grouped = {};
        dayOptions.forEach(d => {
            grouped[d.value] = { name: d.label, color: d.color, courses: [] };
        });

        courses.forEach(course => {
            if (grouped[course.day]) {
                grouped[course.day].courses.push(course);
            }
        });

        Object.keys(grouped).forEach(k => {
            grouped[k].courses.sort((a, b) => {
                return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });
        });

        const daysWithSubjects = Object.values(grouped).filter(g => g.courses.length > 0);

        if (daysWithSubjects.length === 0) {
            return (
                <View style={[styles.card, styles.examCard]}>
                    <View style={styles.cardContent}>
                        <Text style={styles.emptyText}>ไม่มีเรียน</Text>
                    </View>
                </View>
            );
        }

        return daysWithSubjects.map((dayGroup, index) => (
            <View key={index} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: dayGroup.color, paddingLeft: 11 }]}>
                <Text style={[styles.dayText, { color: dayGroup.color }]}>{dayGroup.name}</Text>
                <View style={styles.courseList}>
                    {dayGroup.courses.map(course => (
                        <View key={course.id} style={styles.courseItem}>
                            <View style={styles.courseTime}>
                                <Text style={styles.timeText}>
                                    {new Date(course.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(course.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </Text>
                            </View>
                            <View style={styles.courseDetails}>
                                <Text style={styles.courseName}>{course.subjectCode} {course.subjectName}</Text>
                                <Text style={styles.courseRoom}>ห้อง: {course.room}</Text>
                            </View>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteCourse(course.id)}>
                                <Trash2 size={20} color="#FF6B6B" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+ เพิ่มรายวิชา</Text>
            </TouchableOpacity>

            {renderScheduleCards()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        marginHorizontal: 20,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...COLORS.cardShadow,
        minHeight: 120,
    },
    examCard: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    courseList: {
        marginTop: 10,
    },
    courseItem: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#F7F9FC',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    courseTime: {
        marginRight: 15,
        justifyContent: 'center',
        paddingRight: 15,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
    },
    timeText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    courseDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    courseRoom: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    deleteButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
