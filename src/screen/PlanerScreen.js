import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { sharedStyles } from '../constants/sharedStyles';
import { DataContext } from '../context/DataContext';
import { Trash2, CheckCircle, Circle } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import ScreenHeader from '../components/ScreenHeader';
import TabBar from '../components/TabBar';
import AddActivityModal from '../components/AddActivityModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = [
    { key: 'activity', label: 'กิจกรรม' },
    { key: 'studyPlan', label: 'Study Plan' },
];

export default function PlanerScreen() {
    const {
        courses,
        activities,
        studyPlanItems,
        addActivity,
        deleteActivity,
        addStudyPlanItem,
        toggleStudyPlanItem,
        deleteStudyPlanItem,
    } = useContext(DataContext);

    const [activeTab, setActiveTab] = useState('activity');
    const [studyPlanInput, setStudyPlanInput] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddActivity = async (newActivity) => {
        try {
            await addActivity(newActivity);
            setModalVisible(false);
        } catch (e) { /* handled in DataContext */ }
    };

    const handleDeleteActivity = (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ลบ", style: "destructive", onPress: () => deleteActivity(id) }
            ]
        );
    };

    const handleAddStudyPlanItem = async () => {
        const text = studyPlanInput.trim();
        if (!text) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกรายการที่ต้องการเพิ่ม");
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: Date.now(),
        };

        if (selectedCourseId) {
            const course = courses.find(c => c.id === selectedCourseId);
            if (course) {
                newItem.courseId = course.id;
                newItem.courseName = course.subjectName;
                newItem.courseCode = course.subjectCode;
            }
        }

        setStudyPlanInput('');
        setSelectedCourseId('');
        try {
            await addStudyPlanItem(newItem);
        } catch (e) { /* handled in DataContext */ }
    };

    const handleDeleteStudyPlanItem = (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบรายการนี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ลบ", style: "destructive", onPress: () => deleteStudyPlanItem(id) }
            ]
        );
    };

    const formatActivityDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('th-TH', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatActivityTime = (timeStr) => {
        return new Date(timeStr).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit', hour12: false
        }) + ' น.';
    };

    const renderActivityContent = () => (
        <View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ เพิ่มกิจกรรม</Text>
            </TouchableOpacity>

            {activities.length === 0 ? (
                <View style={[styles.card, styles.emptyCard]}>
                    <Text style={styles.emptyText}>ไม่มีกิจกรรม</Text>
                </View>
            ) : (
                activities.map((activity) => (
                    <View key={activity.id} style={[styles.card, styles.activityCard]}>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>{activity.title}</Text>
                            <Text style={styles.activityTime}>
                                {formatActivityDate(activity.date)} • {formatActivityTime(activity.time)} - {activity.endTime ? formatActivityTime(activity.endTime) : ''}
                            </Text>
                            {!!activity.description && (
                                <Text style={styles.activityDesc}>{activity.description}</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteActivity(activity.id)} style={styles.deleteBtn}>
                            <Trash2 size={20} color="#FF6347" />
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </View>
    );

    const renderStudyPlanContent = () => {
        const completedCount = studyPlanItems.filter(i => i.completed).length;
        const totalCount = studyPlanItems.length;

        return (
            <View style={styles.studyPlanContainer}>
                <View style={styles.card}>
                    <Text style={styles.studyPlanTitle}>แผนการอ่านหนังสือ / Study Checklist</Text>

                    {totalCount > 0 && (
                        <Text style={styles.progressText}>
                            เสร็จแล้ว {completedCount}/{totalCount} รายการ
                        </Text>
                    )}

                    {courses.length > 0 && (
                        <>
                            <Text style={styles.pickerLabel}>เลือกรายวิชา (ไม่บังคับ)</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedCourseId}
                                    onValueChange={(value) => setSelectedCourseId(value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="-- ไม่เลือกวิชา --" value="" />
                                    {courses.map(c => (
                                        <Picker.Item key={c.id} label={`${c.subjectCode} ${c.subjectName}`} value={c.id} />
                                    ))}
                                </Picker>
                            </View>
                        </>
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="เพิ่มรายการอ่านหนังสือ"
                            placeholderTextColor="#ccc"
                            value={studyPlanInput}
                            onChangeText={setStudyPlanInput}
                            onSubmitEditing={handleAddStudyPlanItem}
                            returnKeyType="done"
                        />
                        <TouchableOpacity style={styles.smallAddButton} onPress={handleAddStudyPlanItem}>
                            <Text style={styles.smallAddButtonText}>+ เพิ่ม</Text>
                        </TouchableOpacity>
                    </View>

                    {studyPlanItems.length === 0 ? (
                        <View style={styles.emptyListContainer}>
                            <Text style={styles.emptyText}>ไม่มีรายการ</Text>
                        </View>
                    ) : (
                        studyPlanItems.map((item) => (
                            <View key={item.id} style={[styles.checklistItem, item.completed && styles.checklistItemCompleted]}>
                                <TouchableOpacity
                                    style={styles.checkboxArea}
                                    onPress={() => toggleStudyPlanItem(item.id)}
                                >
                                    {item.completed ? (
                                        <CheckCircle size={24} color={COLORS.success} />
                                    ) : (
                                        <Circle size={24} color={COLORS.border} />
                                    )}
                                    <View style={styles.checklistTextContainer}>
                                        <Text style={[
                                            styles.checklistText,
                                            item.completed && styles.checklistTextCompleted
                                        ]}>
                                            {item.text}
                                        </Text>
                                        {!!item.courseCode && (
                                            <Text style={styles.checklistCourseTag}>
                                                {item.courseCode} {item.courseName}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDeleteStudyPlanItem(item.id)}
                                    style={styles.deleteBtn}
                                >
                                    <Trash2 size={18} color="#FF6347" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={sharedStyles.container}>
            <ScreenHeader />

            <View style={sharedStyles.subheader}>
                <Text style={sharedStyles.sectionTitle}>Activity & Planner</Text>
                <Text style={sharedStyles.sectionSubtitle}>จัดการกิจกรรมและแผนการเรียน</Text>
            </View>

            <TabBar tabs={TABS} activeTab={activeTab} onTabPress={setActiveTab} />

            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'activity' ? renderActivityContent() : renderStudyPlanContent()}
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
    addButton: {
        backgroundColor: COLORS.primary,
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
    },
    emptyCard: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    studyPlanContainer: {
        flex: 1,
    },
    studyPlanTitle: {
        fontSize: 14,
        color: COLORS.primary,
        marginBottom: 15,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 40,
        fontSize: 14,
        color: COLORS.text,
        backgroundColor: COLORS.background,
        marginRight: 10,
    },
    smallAddButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallAddButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    progressText: {
        fontSize: 13,
        color: COLORS.success,
        marginBottom: 12,
        fontWeight: '500',
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    checklistItemCompleted: {
        backgroundColor: '#F0FFF0',
    },
    checkboxArea: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checklistTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    checklistText: {
        fontSize: 15,
        color: COLORS.text,
    },
    checklistCourseTag: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 3,
    },
    pickerLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
        marginBottom: 12,
    },
    picker: {
        height: Platform.OS === 'ios' ? 120 : 54,
        width: '100%',
    },
    checklistTextCompleted: {
        textDecorationLine: 'line-through',
        color: COLORS.textSecondary,
    },
    activityCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
        marginBottom: 4,
    },
    activityDesc: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    deleteBtn: {
        padding: 8,
    }
});
