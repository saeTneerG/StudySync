import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { sharedStyles } from '../constants/sharedStyles';
import { DAY_OPTIONS } from '../constants/dayOptions';
import { DataContext } from '../context/DataContext';
import ScreenHeader from '../components/ScreenHeader';
import TabBar from '../components/TabBar';
import ScheduleTab from '../components/ScheduleTab';
import ExamTab from '../components/ExamTab';
import AddCourseModal from '../components/AddCourseModal';
import AddExamModal from '../components/AddExamModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = [
    { key: 'schedule', label: 'ตารางเรียน' },
    { key: 'exam', label: 'ตารางสอบ' },
];

export default function TimeTableScreen() {
    const { courses, addCourse, deleteCourse, addExam, deleteExam } = useContext(DataContext);

    const [activeTab, setActiveTab] = useState('schedule');
    const [modalVisible, setModalVisible] = useState(false);
    const [examModalVisible, setExamModalVisible] = useState(false);

    const handleAddCourse = async (newCourse) => {
        try {
            await addCourse(newCourse);
            setModalVisible(false);
        } catch (e) { /* handled in DataContext */ }
    };

    const handleAddExam = async (newExam) => {
        try {
            await addExam(newExam);
            setExamModalVisible(false);
        } catch (e) { /* handled in DataContext */ }
    };

    const handleDeleteCourse = (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบวิชานี้และข้อมูลที่เกี่ยวข้อง (เช่น ตารางสอบ) ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ลบ", style: "destructive", onPress: () => deleteCourse(id) }
            ]
        );
    };

    const handleDeleteExam = (examId, courseId) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบตารางสอบนี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ลบ", style: "destructive", onPress: () => deleteExam(examId, courseId) }
            ]
        );
    };

    const allExams = useMemo(() => {
        return courses.reduce((acc, course) => {
            const courseExams = (course.exams || []).map(e => ({
                ...e,
                courseId: course.id,
                subjectName: course.subjectName,
                subjectCode: course.subjectCode
            }));
            return [...acc, ...courseExams];
        }, []);
    }, [courses]);

    return (
        <SafeAreaView style={sharedStyles.container}>
            <ScreenHeader />

            <View style={sharedStyles.subheader}>
                <Text style={sharedStyles.sectionTitle}>Academic</Text>
                <Text style={sharedStyles.sectionSubtitle}>จัดการตารางเรียนและตารางสอบ</Text>
            </View>

            <TabBar tabs={TABS} activeTab={activeTab} onTabPress={setActiveTab} />

            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'schedule' ? (
                    <ScheduleTab
                        courses={courses}
                        dayOptions={DAY_OPTIONS}
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
                dayOptions={DAY_OPTIONS}
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
