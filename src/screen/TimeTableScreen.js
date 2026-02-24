import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { X, Clock } from 'lucide-react-native';

export default function TimeTableScreen() {
    const { userInfo } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('schedule');

    const [courses, setCourses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [room, setRoom] = useState('');
    const [day, setDay] = useState('จันทร์');

    const defaultStart = new Date();
    defaultStart.setHours(9, 0, 0, 0);
    const defaultEnd = new Date();
    defaultEnd.setHours(12, 0, 0, 0);

    const [startTime, setStartTime] = useState(defaultStart);
    const [endTime, setEndTime] = useState(defaultEnd);
    const [showTimePicker, setShowTimePicker] = useState(null);

    const dayOptions = [
        { label: 'จันทร์', value: 'จันทร์', color: '#FFD700' },
        { label: 'อังคาร', value: 'อังคาร', color: '#FFB6C1' },
        { label: 'พุธ', value: 'พุธ', color: '#98FB98' },
        { label: 'พฤหัสบดี', value: 'พฤหัสบดี', color: '#FFA500' },
        { label: 'ศุกร์', value: 'ศุกร์', color: '#87CEFA' },
        { label: 'เสาร์', value: 'เสาร์', color: '#DDA0DD' },
        { label: 'อาทิตย์', value: 'อาทิตย์', color: '#FF0000' }
    ];

    const loadCourses = async () => {
        if (!userInfo) return;
        try {
            const key = `@courses_${userInfo.email}`;
            const storedCourses = await AsyncStorage.getItem(key);
            if (storedCourses) {
                setCourses(JSON.parse(storedCourses));
            }
        } catch (e) {
            console.error("Failed to load courses", e);
        }
    };

    useEffect(() => {
        loadCourses();
    }, [userInfo]);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const parseTimeToMinutes = (dateObj) => {
        return dateObj.getHours() * 60 + dateObj.getMinutes();
    };

    const resetForm = () => {
        setSubjectName('');
        setSubjectCode('');
        setRoom('');
        setDay('จันทร์');
        setStartTime(defaultStart);
        setEndTime(defaultEnd);
    };

    const handleAddCourse = async () => {
        if (!subjectName || !subjectCode || !room) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const startMinutes = parseTimeToMinutes(startTime);
        const endMinutes = parseTimeToMinutes(endTime);

        if (startMinutes >= endMinutes) {
            Alert.alert("ข้อผิดพลาด", "เวลาเริ่มต้องก่อนเวลาจบ");
            return;
        }

        const hasOverlap = courses.some(course => {
            if (course.day === day) {
                const courseStart = parseTimeToMinutes(new Date(course.startTime));
                const courseEnd = parseTimeToMinutes(new Date(course.endTime));
                return Math.max(startMinutes, courseStart) < Math.min(endMinutes, courseEnd);
            }
            return false;
        });

        if (hasOverlap) {
            Alert.alert("ข้อผิดพลาด", "เวลาเรียนชนกับวิชาอื่นในวันเดียวกัน");
            return;
        }

        const newCourse = {
            id: Date.now().toString(),
            subjectName,
            subjectCode,
            room,
            day,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);

        try {
            if (userInfo) {
                const key = `@courses_${userInfo.email}`;
                await AsyncStorage.setItem(key, JSON.stringify(updatedCourses));
            }
            setModalVisible(false);
            resetForm();
        } catch (e) {
            console.error("Failed to save course", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
        }
    };

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
                        </View>
                    ))}
                </View>
            </View>
        ));
    };

    const renderExamCard = () => {
        return (
            <View style={[styles.card, styles.examCard]}>
                <View style={styles.cardContent}>
                    <Text style={styles.emptyText}>ไม่มีตารางสอบ</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>StudySync</Text>
                <Text style={styles.greetingText}>สวัสดี {userInfo?.name}</Text>
            </View>

            <View style={styles.subheader}>
                <Text style={styles.sectionTitle}>Academic</Text>
                <Text style={styles.sectionSubtitle}>จัดการตารางเรียนและตารางสอบ</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'schedule' && styles.activeTabButton]}
                    onPress={() => setActiveTab('schedule')}
                >
                    <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>
                        ตารางเรียน
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'exam' && styles.activeTabButton]}
                    onPress={() => setActiveTab('exam')}
                >
                    <Text style={[styles.tabText, activeTab === 'exam' && styles.activeTabText]}>
                        ตารางสอบ
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    if (activeTab === 'schedule') {
                        setModalVisible(true);
                    }
                }}
            >
                <Text style={styles.addButtonText}>
                    {activeTab === 'schedule' ? '+ เพิ่มรายวิชา' : '+ เพิ่มตารางสอบ'}
                </Text>
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'schedule' ? renderScheduleCards() : renderExamCard()}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>เพิ่มรายวิชา</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                                <X size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                            <Text style={styles.inputLabel}>ชื่อวิชา</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="เช่น คณิตศาสตร์"
                                value={subjectName}
                                onChangeText={setSubjectName}
                                placeholderTextColor="#A0A0A0"
                            />

                            <Text style={styles.inputLabel}>รหัสวิชา</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="เช่น MATH101"
                                value={subjectCode}
                                onChangeText={setSubjectCode}
                                placeholderTextColor="#A0A0A0"
                            />

                            <Text style={styles.inputLabel}>ห้องเรียน</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="เช่น ห้อง 301"
                                value={room}
                                onChangeText={setRoom}
                                placeholderTextColor="#A0A0A0"
                            />

                            <Text style={styles.inputLabel}>วัน</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={day}
                                    onValueChange={(itemValue) => setDay(itemValue)}
                                    style={styles.picker}
                                >
                                    {dayOptions.map(d => (
                                        <Picker.Item key={d.value} label={d.label} value={d.value} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={styles.timeRow}>
                                <View style={[styles.timeColumn, { marginRight: 10 }]}>
                                    <Text style={styles.inputLabel}>เวลาเริ่ม</Text>
                                    <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker('start')}>
                                        <Text style={styles.timePickerText}>{formatTime(startTime)}</Text>
                                        <Clock size={20} color={COLORS.text} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.timeColumn, { marginLeft: 10 }]}>
                                    <Text style={styles.inputLabel}>เวลาจบ</Text>
                                    <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker('end')}>
                                        <Text style={styles.timePickerText}>{formatTime(endTime)}</Text>
                                        <Clock size={20} color={COLORS.text} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={showTimePicker === 'start' ? startTime : endTime}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const pickerType = showTimePicker;
                                        setShowTimePicker(Platform.OS === 'ios' ? pickerType : null);
                                        if (selectedDate) {
                                            if (pickerType === 'start') {
                                                setStartTime(selectedDate);
                                            } else {
                                                setEndTime(selectedDate);
                                            }
                                        }
                                    }}
                                />
                            )}

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.modalButton, styles.addBtn]} onPress={handleAddCourse}>
                                    <Text style={styles.addBtnText}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => { setModalVisible(false); resetForm(); }}>
                                    <Text style={styles.cancelBtnText}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 4,
        borderBottomColor: COLORS.border,
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    greetingText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    subheader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        marginBottom: 15,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: COLORS.white,
        fontWeight: 'bold',
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '85%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        ...COLORS.cardShadow,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
    },
    picker: {
        height: Platform.OS === 'ios' ? 120 : 54,
        width: '100%',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    timeColumn: {
        flex: 1,
    },
    timePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 14,
        backgroundColor: COLORS.background,
    },
    timePickerText: {
        fontSize: 16,
        color: COLORS.text,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        marginRight: 10,
    },
    addBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelBtn: {
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
    },
    cancelBtnText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
