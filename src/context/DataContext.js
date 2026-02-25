import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext);

    const [courses, setCourses] = useState([]);
    const [activities, setActivities] = useState([]);
    const [studyPlanItems, setStudyPlanItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadAllData = useCallback(async () => {
        if (!userInfo?.id) return;
        setIsLoading(true);
        try {
            const coursesRef = collection(db, "users", userInfo.id, "courses");
            const courseSnapshot = await getDocs(coursesRef);
            const loadedCourses = [];
            courseSnapshot.forEach((d) => {
                loadedCourses.push({ id: d.id, ...d.data(), exams: d.data().exams || [] });
            });
            setCourses(loadedCourses);

            const activitiesRef = collection(db, "users", userInfo.id, "activities");
            const activitySnapshot = await getDocs(activitiesRef);
            const loadedActivities = [];
            activitySnapshot.forEach((d) => {
                loadedActivities.push({ id: d.id, ...d.data() });
            });
            loadedActivities.sort((a, b) => new Date(a.time) - new Date(b.time));
            setActivities(loadedActivities);

            const studyPlanRef = collection(db, "users", userInfo.id, "studyPlanItems");
            const studyPlanSnapshot = await getDocs(studyPlanRef);
            const loadedStudyPlanItems = [];
            studyPlanSnapshot.forEach((d) => {
                loadedStudyPlanItems.push({ id: d.id, ...d.data() });
            });
            loadedStudyPlanItems.sort((a, b) => a.createdAt - b.createdAt);
            setStudyPlanItems(loadedStudyPlanItems);
        } catch (e) {
            console.error("Failed to load data from Firestore", e);
        } finally {
            setIsLoading(false);
        }
    }, [userInfo?.id]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const addCourse = async (newCourse) => {
        if (!userInfo?.id) return;
        const courseWithExams = { ...newCourse, exams: [] };
        setCourses(prev => [...prev, courseWithExams]);

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", newCourse.id);
            await setDoc(courseRef, courseWithExams);
        } catch (e) {
            console.error("Failed to save course", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            setCourses(prev => prev.filter(c => c.id !== newCourse.id));
            throw e;
        }
    };

    const deleteCourse = async (id) => {
        if (!userInfo?.id) return;
        const previous = [...courses];
        setCourses(prev => prev.filter(c => c.id !== id));

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", id);
            await deleteDoc(courseRef);
        } catch (e) {
            console.error("Failed to delete course", e);
            setCourses(previous);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
        }
    };

    const clearAllCourses = async () => {
        if (!userInfo?.id) return;
        try {
            const coursesRef = collection(db, "users", userInfo.id, "courses");
            const snapshot = await getDocs(coursesRef);
            const deletePromises = [];
            snapshot.forEach((document) => {
                deletePromises.push(deleteDoc(doc(db, "users", userInfo.id, "courses", document.id)));
            });
            await Promise.all(deletePromises);
            setCourses([]);
            Alert.alert('สำเร็จ', 'ล้างข้อมูลการเรียนเรียบร้อยแล้ว');
        } catch (e) {
            console.error("Failed to delete courses", e);
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถล้างข้อมูลได้');
        }
    };

    const addExam = async (newExam) => {
        if (!userInfo?.id) return;
        let targetCourse = null;
        const previous = [...courses];
        const updated = courses.map(course => {
            if (course.id === newExam.courseId) {
                targetCourse = { ...course, exams: [...course.exams, newExam] };
                return targetCourse;
            }
            return course;
        });
        if (!targetCourse) return;
        setCourses(updated);

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", targetCourse.id);
            await setDoc(courseRef, targetCourse);
        } catch (e) {
            console.error("Failed to save exam", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            setCourses(previous);
            throw e;
        }
    };

    const deleteExam = async (examId, courseId) => {
        if (!userInfo?.id) return;
        const previous = [...courses];
        let targetCourse = null;
        const updated = courses.map(course => {
            if (course.id === courseId) {
                targetCourse = { ...course, exams: course.exams.filter(e => e.id !== examId) };
                return targetCourse;
            }
            return course;
        });
        setCourses(updated);

        if (targetCourse) {
            try {
                const courseRef = doc(db, "users", userInfo.id, "courses", courseId);
                await setDoc(courseRef, targetCourse);
            } catch (e) {
                console.error("Failed to delete exam", e);
                setCourses(previous);
                Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
            }
        }
    };

    const addActivity = async (newActivity) => {
        if (!userInfo?.id) return;
        setActivities(prev =>
            [...prev, newActivity].sort((a, b) => new Date(a.time) - new Date(b.time))
        );

        try {
            const activityRef = doc(db, "users", userInfo.id, "activities", newActivity.id);
            await setDoc(activityRef, newActivity);
        } catch (e) {
            console.error("Failed to save activity", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            setActivities(prev => prev.filter(a => a.id !== newActivity.id));
            throw e;
        }
    };

    const deleteActivity = async (id) => {
        if (!userInfo?.id) return;
        const previous = [...activities];
        setActivities(prev => prev.filter(a => a.id !== id));

        try {
            const activityRef = doc(db, "users", userInfo.id, "activities", id);
            await deleteDoc(activityRef);
        } catch (e) {
            console.error("Failed to delete activity", e);
            setActivities(previous);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
        }
    };

    const addStudyPlanItem = async (newItem) => {
        if (!userInfo?.id) return;
        setStudyPlanItems(prev => [...prev, newItem]);

        try {
            const itemRef = doc(db, "users", userInfo.id, "studyPlanItems", newItem.id);
            await setDoc(itemRef, newItem);
        } catch (e) {
            console.error("Failed to save study plan item", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรายการได้");
            setStudyPlanItems(prev => prev.filter(i => i.id !== newItem.id));
            throw e;
        }
    };

    const toggleStudyPlanItem = async (id) => {
        if (!userInfo?.id) return;
        const item = studyPlanItems.find(i => i.id === id);
        if (!item) return;

        const updatedCompleted = !item.completed;
        setStudyPlanItems(prev =>
            prev.map(i => i.id === id ? { ...i, completed: updatedCompleted } : i)
        );

        try {
            const itemRef = doc(db, "users", userInfo.id, "studyPlanItems", id);
            await updateDoc(itemRef, { completed: updatedCompleted });
        } catch (e) {
            console.error("Failed to update study plan item", e);
            setStudyPlanItems(prev =>
                prev.map(i => i.id === id ? { ...i, completed: !updatedCompleted } : i)
            );
        }
    };

    const deleteStudyPlanItem = async (id) => {
        if (!userInfo?.id) return;
        const previous = [...studyPlanItems];
        setStudyPlanItems(prev => prev.filter(i => i.id !== id));

        try {
            const itemRef = doc(db, "users", userInfo.id, "studyPlanItems", id);
            await deleteDoc(itemRef);
        } catch (e) {
            console.error("Failed to delete study plan item", e);
            setStudyPlanItems(previous);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบรายการได้");
        }
    };

    return (
        <DataContext.Provider value={{
            courses,
            activities,
            studyPlanItems,
            isLoading,
            addCourse,
            deleteCourse,
            clearAllCourses,
            addExam,
            deleteExam,
            addActivity,
            deleteActivity,
            addStudyPlanItem,
            toggleStudyPlanItem,
            deleteStudyPlanItem,
            refreshData: loadAllData,
        }}>
            {children}
        </DataContext.Provider>
    );
};
