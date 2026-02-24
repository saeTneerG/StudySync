import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';

export default function PlanerScreen() {
    const [activeTab, setActiveTab] = useState('activity'); // 'activity' or 'studyPlan'
    const [studyPlanInput, setStudyPlanInput] = useState('');

    const renderActivityContent = () => {
        return (
            <View>
                {/* Main Action Button */}
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ เพิ่มกิจกรรม</Text>
                </TouchableOpacity>

                {/* Empty State Card */}
                <View style={[styles.card, styles.emptyCard]}>
                    <View style={styles.cardContent}>
                        <Text style={styles.emptyText}>ไม่มีกิจกรรม</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderStudyPlanContent = () => {
        return (
            <View style={styles.studyPlanContainer}>
                <View style={styles.card}>
                    <Text style={styles.studyPlanTitle}>แผนการอ่านหนังสือ / Study Checklist</Text>

                    {/* Input Row */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="เพิ่มรายการอ่านหนังสือ"
                            placeholderTextColor="#ccc"
                            value={studyPlanInput}
                            onChangeText={setStudyPlanInput}
                        />
                        <TouchableOpacity style={styles.smallAddButton}>
                            <Text style={styles.smallAddButtonText}>+ เพิ่ม</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Empty List Area */}
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyText}>ไม่มีรายการ</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.logoText}>StudySync</Text>
                <Text style={styles.greetingText}>สวัสดี สมชาย ใจดี</Text>
            </View>

            {/* Subheader Section */}
            <View style={styles.subheader}>
                <Text style={styles.sectionTitle}>Activity & Planner</Text>
                <Text style={styles.sectionSubtitle}>จัดการกิจกรรมและแผนการเรียน</Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'activity' && styles.activeTabButton]}
                    onPress={() => setActiveTab('activity')}
                >
                    <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
                        กิจกรรม
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'studyPlan' && styles.activeTabButton]}
                    onPress={() => setActiveTab('studyPlan')}
                >
                    <Text style={[styles.tabText, activeTab === 'studyPlan' && styles.activeTabText]}>
                        Study Plan
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'activity' ? renderActivityContent() : renderStudyPlanContent()}
            </ScrollView>
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
        flexGrow: 1,
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
        height: 120, // To give it the rectangular shape shown in the design
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 30, // Space before empty list
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
    }
});
