const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const userProgressCollection = db.collection('userProgress');
const quizResultsCollection = db.collection('quizResults');
const modulesCollection = db.collection('educationModules');
const gameResultsCollection = db.collection('gameResults');

const markLessonAsComplete = async (uid, moduleId, lessonId) => {
    const progressRef = userProgressCollection.doc(uid);
    const progressDoc = await progressRef.get();
    const lessonIdentifier = `${moduleId}_${lessonId}`;

    if (progressDoc.exists) {
        await progressRef.update({ completedLessons: FieldValue.arrayUnion(lessonIdentifier) });
    } else {
        await progressRef.set({ uid: uid, completedLessons: [lessonIdentifier], earnedBadges: [] });
    }

    const moduleDoc = await db.collection('educationModules').doc(moduleId).get();
    if (!moduleDoc.exists) {
        return { success: true, message: "Lesson marked complete, but module not found for badge check."};
    }

    const moduleData = moduleDoc.data();
    if (!moduleData.lessons || !moduleData.badgeName) {
        return { success: true, message: "Lesson marked complete. Module has no badge to award."};
    }

    const totalLessonsInModule = moduleData.lessons.length;
    
    const updatedProgressDoc = await progressRef.get();
    const { completedLessons = [], earnedBadges = [] } = updatedProgressDoc.data();
    
    const hasBadge = earnedBadges.some(badge => badge.name === moduleData.badgeName);
    if (hasBadge) {
        return { success: true, message: "Lesson marked complete. Badge already earned."};
    }

    const completedInModule = completedLessons.filter(lesson => lesson.startsWith(moduleId)).length;

    if (completedInModule >= totalLessonsInModule) {
        const badge = {
            name: moduleData.badgeName,
            iconUrl: moduleData.badgeIconUrl,
            courseTitle: moduleData.title,
            earnedAt: new Date().toISOString()
        };
        await progressRef.update({
            earnedBadges: FieldValue.arrayUnion(badge)
        });
        console.log(`Awarded badge "${badge.name}" to user ${uid}`);
    }

    return { success: true, message: `Lesson ${lessonIdentifier} marked as complete.` };
};

const saveQuizResult = async (uid, moduleId, lessonId, score, totalQuestions) => {
    const resultIdentifier = `${uid}_${moduleId}_${lessonId}`;
    await quizResultsCollection.doc(resultIdentifier).set({
        uid, moduleId, lessonId, score, totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        completedAt: new Date().toISOString(),
    });
    return await markLessonAsComplete(uid, moduleId, lessonId);
};

const getUserProgress = async (uid) => {
    const progressDoc = await userProgressCollection.doc(uid).get();
    const progressData = progressDoc.exists ? progressDoc.data() : { completedLessons: [], earnedBadges: [] };
    
    const quizResultsSnap = await quizResultsCollection.where('uid', '==', uid).get();
    const quizResults = quizResultsSnap.docs.map(doc => doc.data());
    
    const modulesSnap = await modulesCollection.get();
    const modulesMap = new Map();
    modulesSnap.forEach(doc => modulesMap.set(doc.id, doc.data()));

    const detailedQuizResults = quizResults.map(result => {
        const module = modulesMap.get(result.moduleId);
        if (module && module.lessons) {
            const lesson = module.lessons.find(l => l.id === result.lessonId);
            return {
                ...result,
                moduleTitle: module.title || 'Unknown Course',
                lessonTitle: lesson ? lesson.title : 'Unknown Quiz',
            };
        }
        return result;
    });

    return {
        completedLessons: progressData.completedLessons || [],
        completedLessonsCount: progressData.completedLessons.length,
        quizResults: detailedQuizResults,
        earnedBadges: progressData.earnedBadges || [],
    };
};

// --- NEW FUNCTION: Saves the result of a game for a user ---
const saveGameResult = async (uid, gameName, score, maxScore) => {
    const result = {
        uid,
        gameName,
        score,
        maxScore,
        percentage: Math.round((score / maxScore) * 100),
        completedAt: new Date().toISOString(),
    };
    // We can use .add() here as a user might play the same game multiple times
    await gameResultsCollection.add(result);
    return { success: true, message: 'Game result saved.' };
};

module.exports = {
    markLessonAsComplete,
    saveQuizResult,
    getUserProgress,
    saveGameResult,
};