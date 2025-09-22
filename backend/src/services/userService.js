const { db, auth } = require('../config/firebase');
const usersCollection = db.collection('users');

/**
 * Creates a new user. The logic for a parent linking to a child is REMOVED.
 * Parents now sign up simply and wait for a teacher to link them.
 */
const createUser = async (userData) => {
    const { email, password, fullName, role, institutionId, schoolName, grade, city } = userData;

    if (!email || !password || !fullName || !role) {
        throw new Error("Missing required fields: email, password, fullName, role.");
    }
    
    const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
    });

    await auth.setCustomUserClaims(userRecord.uid, { role });

    const userProfile = {
        uid: userRecord.uid,
        email,
        fullName,
        role,
        // Parents no longer provide an institution ID at signup. It will be added by the teacher.
        institutionId: role === 'parent' ? null : institutionId,
        schoolName: schoolName || null,
        grade: grade || null,
        city: city || null,
        createdAt: new Date().toISOString(),
    };
    await usersCollection.doc(userRecord.uid).set(userProfile);
    return userProfile;
};

const getUserById = async (uid) => {
    const userDoc = await usersCollection.doc(uid).get();
    if (!userDoc.exists) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return userDoc.data();
};

const updateUserProfile = async (uid, profileData) => {
    const { fullName, schoolName, grade, city } = profileData;
    const dataToUpdate = {};
    if (fullName) dataToUpdate.fullName = fullName;
    if (schoolName) dataToUpdate.schoolName = schoolName;
    if (grade) dataToUpdate.grade = grade;
    if (city) dataToUpdate.city = city;

    if (Object.keys(dataToUpdate).length === 0) {
        throw new Error("No data provided for update.");
    }
    
    if (fullName) {
        await auth.updateUser(uid, { displayName: fullName });
    }

    const userRef = usersCollection.doc(uid);
    await userRef.update(dataToUpdate);
    const updatedUserDoc = await userRef.get();
    return updatedUserDoc.data();
};

/**
 * Gets a child's profile for a parent by looking for the student linked TO the parent.
 */
const getChildProfile = async (parentUid) => {
    const studentQuery = usersCollection.where('parentId', '==', parentUid).limit(1);
    const snapshot = await studentQuery.get();

    if (snapshot.empty) {
        const error = new Error("No child is linked to your account. Please contact your child's teacher.");
        error.statusCode = 404;
        throw error;
    }
    
    const childDoc = snapshot.docs[0];
    const childData = childDoc.data();

    // The old code was just "return childData;". The new code includes the ID.
    // We are now combining the document's ID with its data.
    return {
        uid: childDoc.id, // Add the document ID as the 'uid'
        ...childData     // Include all the other fields (fullName, email, etc.)
    };
};

/**
 * Securely updates a linked child's profile, initiated by a parent.
 */
const updateChildProfile = async (parentUid, childData) => {
    const studentQuery = usersCollection.where('parentId', '==', parentUid).limit(1);
    const snapshot = await studentQuery.get();
    if (snapshot.empty) {
        const error = new Error("You are not linked to a child profile, so you cannot update it.");
        error.statusCode = 403;
        throw error;
    }
    const childUid = snapshot.docs[0].id;
    return await updateUserProfile(childUid, childData);
};

module.exports = {
    createUser,
    getUserById,
    updateUserProfile,
    getChildProfile,
    updateChildProfile,
};