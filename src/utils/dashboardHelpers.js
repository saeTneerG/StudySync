import { COLORS } from '../constants/colors';

export const getNextClass = (courses) => {
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

export const getUpcomingExams = (courses) => {
    if (!courses || courses.length === 0) return [];

    let allExams = [];
    courses.forEach(course => {
        if (course.exams && Array.isArray(course.exams)) {
            course.exams.forEach(exam => {
                allExams.push({
                    ...exam,
                    subjectName: exam.subjectName || course.subjectName,
                    subjectCode: exam.subjectCode || course.subjectCode,
                });
            });
        }
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOf7Days = startOfToday + (7 * 24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000 - 1);

    const upcomingExams = allExams.filter(exam => {
        if (!exam.date) return false;
        const examDate = new Date(exam.date).getTime();
        return examDate >= startOfToday && examDate <= endOf7Days;
    });

    upcomingExams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingExams;
}

export const getAllClasses = (courses) => {
    if (!courses || courses.length === 0) return [];

    let allClasses = [];
    const dayMap = { 'อาทิตย์': 0, 'จันทร์': 1, 'อังคาร': 2, 'พุธ': 3, 'พฤหัสบดี': 4, 'ศุกร์': 5, 'เสาร์': 6 };

    courses.forEach(course => {
        const courseSchedules = course.schedules || [{
            id: 'legacy',
            day: course.day,
            startTime: course.startTime,
            endTime: course.endTime
        }];

        courseSchedules.forEach(sch => {
            if (!sch.day || !sch.startTime || !sch.endTime) return;
            allClasses.push({
                ...course,
                day: sch.day,
                startTime: sch.startTime,
                endTime: sch.endTime,
                dayIndex: dayMap[sch.day] || 0
            });
        });
    });

    allClasses.sort((a, b) => {
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
        const aStart = new Date(a.startTime);
        const bStart = new Date(b.startTime);
        return (aStart.getHours() * 60 + aStart.getMinutes()) - (bStart.getHours() * 60 + bStart.getMinutes());
    });

    return allClasses;
};

export const getAllExams = (courses) => {
    if (!courses || courses.length === 0) return [];

    let allExams = [];
    courses.forEach(course => {
        if (course.exams && Array.isArray(course.exams)) {
            course.exams.forEach(exam => {
                allExams.push({
                    ...exam,
                    subjectName: exam.subjectName || course.subjectName,
                    subjectCode: exam.subjectCode || course.subjectCode,
                });
            });
        }
    });

    allExams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return allExams;
};
