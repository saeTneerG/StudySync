import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/colors';

export default function TimeTableScreen() {
    const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'exam'

    const renderScheduleCards = () => {
        // For now, representing an empty schedule where no days have subjects mapped yet.
        const daysWithSubjects = []; // Replace with actual logic to fetch/filter schedule data

        if (daysWithSubjects.length === 0) {
            return (
                <View style={[styles.card, styles.examCard]}>
                    <View style={styles.cardContent}>
                        <Text style={styles.emptyText}>ไม่มีเรียน</Text>
                    </View>
                </View>
            );
        }

        return daysWithSubjects.map((day) => (
            <View key={day.id} style={styles.card}>
                <Text style={[styles.dayText, { color: day.color }]}>{day.name}</Text>
                <View style={styles.cardContent}>
                    {/* Render actual subjects here later */}
                    <Text style={styles.emptyText}>ไม่มีวิชา</Text>
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
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.logoText}>StudySync</Text>
                <Text style={styles.greetingText}>สวัสดี สมชาย ใจดี</Text>
            </View>

            {/* Subheader Section */}
            <View style={styles.subheader}>
                <Text style={styles.sectionTitle}>Academic</Text>
                <Text style={styles.sectionSubtitle}>จัดการตารางเรียนและตารางสอบ</Text>
            </View>

            {/* Tab Switcher */}
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

            {/* Main Action Button */}
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>
                    {activeTab === 'schedule' ? '+ เพิ่มรายวิชา' : '+ เพิ่มตารางสอบ'}
                </Text>
            </TouchableOpacity>

            {/* Content List */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'schedule' ? renderScheduleCards() : renderExamCard()}
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
        minHeight: 120, // To give it the rectangular shape shown in the design
    },
    examCard: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20,
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
});
