import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import ScheduleTab from '../components/ScheduleTab';
import ExamTab from '../components/ExamTab';
import AddCourseModal from '../components/AddCourseModal';
import AddExamModal from '../components/AddExamModal';
import { useFocusEffect } from '@react-navigation/native';

export default function TimeTableScreen() {
    const { userInfo } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('schedule');

    const [courses, setCourses] = useState([]);

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
        if (!userInfo || !userInfo.id) return;
        try {
            const coursesRef = collection(db, "users", userInfo.id, "courses");
            const snapshot = await getDocs(coursesRef);

            let loadedCourses = [];
            snapshot.forEach((doc) => {
                loadedCourses.push({ id: doc.id, ...doc.data() });
            });

            // Ensure all courses have an exams array
            loadedCourses = loadedCourses.map(c => ({
                ...c,
                exams: c.exams || []
            }));

            setCourses(loadedCourses);
        } catch (e) {
            console.error("Failed to load data from Firestore", e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [userInfo])
    );

    const handleAddCourse = async (newCourse) => {
        if (!userInfo || !userInfo.id) return;
        const courseWithExams = { ...newCourse, exams: [] };

        // Optimistic update
        const updatedCourses = [...courses, courseWithExams];
        setCourses(updatedCourses);

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", newCourse.id);
            await setDoc(courseRef, courseWithExams);
            setModalVisible(false);
        } catch (e) {
            console.error("Failed to save course to Firestore", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            // Revert optimistic update on failure
            setCourses(courses);
        }
    };

    const handleAddExam = async (newExam) => {
        if (!userInfo || !userInfo.id) return;

        let targetCourse = null;
        const updatedCourses = courses.map(course => {
            if (course.id === newExam.courseId) {
                targetCourse = { ...course, exams: [...course.exams, newExam] };
                return targetCourse;
            }
            return course;
        });

        if (!targetCourse) return;

        setCourses(updatedCourses);

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", targetCourse.id);
            await setDoc(courseRef, targetCourse);
            setExamModalVisible(false);
        } catch (e) {
            console.error("Failed to save exam to Firestore", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            setCourses(courses);
        }
    };

    const handleDeleteCourse = (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบวิชานี้และข้อมูลที่เกี่ยวข้อง (เช่น ตารางสอบ) ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        if (!userInfo || !userInfo.id) return;
                        const previousCourses = [...courses];
                        const updatedCourses = courses.filter(course => course.id !== id);
                        setCourses(updatedCourses);

                        try {
                            const courseRef = doc(db, "users", userInfo.id, "courses", id);
                            await deleteDoc(courseRef);
                        } catch (error) {
                            console.error("Failed to delete course from Firestore", error);
                            setCourses(previousCourses);
                            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteExam = (examId, courseId) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบตารางสอบนี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        if (!userInfo || !userInfo.id) return;
                        const previousCourses = [...courses];
                        let targetCourse = null;

                        const updatedCourses = courses.map(course => {
                            if (course.id === courseId) {
                                targetCourse = {
                                    ...course,
                                    exams: course.exams.filter(e => e.id !== examId)
                                };
                                return targetCourse;
                            }
                            return course;
                        });

                        setCourses(updatedCourses);

                        if (targetCourse) {
                            try {
                                const courseRef = doc(db, "users", userInfo.id, "courses", courseId);
                                await setDoc(courseRef, targetCourse);
                            } catch (e) {
                                console.error("Failed to delete exam from Firestore", e);
                                setCourses(previousCourses);
                                Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
                            }
                        }
                    }
                }
            ]
        );
    };

    // Extract all exams flatly for the ExamTab
    const allExams = courses.reduce((acc, course) => {
        const courseExams = (course.exams || []).map(e => ({
            ...e,
            courseId: course.id,
            subjectName: course.subjectName,
            subjectCode: course.subjectCode
        }));
        return [...acc, ...courseExams];
    }, []);

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
                        exams={allExams}
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
                exams={allExams}
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
