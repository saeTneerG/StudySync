import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import ScheduleTab from '../components/ScheduleTab';
import ExamTab from '../components/ExamTab';
import AddCourseModal from '../components/AddCourseModal';
import AddExamModal from '../components/AddExamModal';

export default function TimeTableScreen() {
    const { userInfo } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('schedule');

    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [examModalVisible, setExamModalVisible] = useState(false);

    const dayOptions = [
        { label: 'จันทร์', value: 'จันทร์', color: '#FFD700' },
        { label: 'อังคาร', value: 'อังคาร', color: '#FFB6C1' },
        { label: 'พุธ', value: 'พุธ', color: '#98FB98' },
        { label: 'พฤหัสบดี', value: 'พฤหัสบดี', color: '#FFA500' },
        { label: 'ศุกร์', value: 'ศุกร์', color: '#87CEFA' },
        { label: 'เสาร์', value: 'เสาร์', color: '#DDA0DD' },
        { label: 'อาทิตย์', value: 'อาทิตย์', color: '#FF0000' }
    ];

    const loadData = async () => {
        if (!userInfo) return;
        try {
            const courseKey = `@courses_${userInfo.email}`;
            const storedCourses = await AsyncStorage.getItem(courseKey);
            if (storedCourses) {
                setCourses(JSON.parse(storedCourses));
            }

            const examKey = `@exams_${userInfo.email}`;
            const storedExams = await AsyncStorage.getItem(examKey);
            if (storedExams) {
                setExams(JSON.parse(storedExams));
            }
        } catch (e) {
            console.error("Failed to load data", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [userInfo]);

    const handleAddCourse = async (newCourse) => {
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);

        try {
            if (userInfo) {
                const key = `@courses_${userInfo.email}`;
                await AsyncStorage.setItem(key, JSON.stringify(updatedCourses));
            }
            setModalVisible(false);
        } catch (e) {
            console.error("Failed to save course", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
        }
    };

    const handleAddExam = async (newExam) => {
        const updatedExams = [...exams, newExam];
        setExams(updatedExams);

        try {
            if (userInfo) {
                const key = `@exams_${userInfo.email}`;
                await AsyncStorage.setItem(key, JSON.stringify(updatedExams));
            }
            setExamModalVisible(false);
        } catch (e) {
            console.error("Failed to save exam", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
        }
    };

    const handleDeleteCourse = (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบวิชานี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        const updatedCourses = courses.filter(course => course.id !== id);
                        setCourses(updatedCourses);
                        if (userInfo) {
                            const key = `@courses_${userInfo.email}`;
                            await AsyncStorage.setItem(key, JSON.stringify(updatedCourses));
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteExam = (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบตารางสอบนี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        const updatedExams = exams.filter(exam => exam.id !== id);
                        setExams(updatedExams);
                        if (userInfo) {
                            const key = `@exams_${userInfo.email}`;
                            await AsyncStorage.setItem(key, JSON.stringify(updatedExams));
                        }
                    }
                }
            ]
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

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'schedule' ? (
                    <ScheduleTab
                        courses={courses}
                        dayOptions={dayOptions}
                        setModalVisible={setModalVisible}
                        onDeleteCourse={handleDeleteCourse}
                    />
                ) : (
                    <ExamTab
                        exams={exams}
                        setExamModalVisible={setExamModalVisible}
                        onDeleteExam={handleDeleteExam}
                    />
                )}
            </ScrollView>

            <AddCourseModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAddCourse={handleAddCourse}
                courses={courses}
                dayOptions={dayOptions}
            />

            <AddExamModal
                visible={examModalVisible}
                onClose={() => setExamModalVisible(false)}
                onAddExam={handleAddExam}
                courses={courses}
                exams={exams}
            />
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
});
