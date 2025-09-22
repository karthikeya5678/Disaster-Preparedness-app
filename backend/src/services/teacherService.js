const { db } = require('../config/firebase');
const usersCollection = db.collection('users');

const getStudentsByInstitution = async (institutionId) => {
    // --- DEBUG LOG ---
    console.log(`[Backend Log] Searching for STUDENTS with institutionId: "${institutionId}"`);

    const studentsSnap = await usersCollection.where('institutionId', '==', institutionId).where('role', '==', 'student').get();
    const students = studentsSnap.docs.map(doc => doc.data());

    // --- DEBUG LOG ---
    console.log(`[Backend Log] Found ${students.length} student(s).`);

    const promises = students.map(async (student) => {
        if (student.parentId) {
            const parentDoc = await usersCollection.doc(student.parentId).get();
            if (parentDoc.exists) { student.parentName = parentDoc.data().fullName; }
        }
        return student;
    });
    return Promise.all(promises);
};

const getUnlinkedParents = async () => {
    // --- DEBUG LOG ---
    console.log(`[Backend Log] Searching for all unlinked PARENTS.`);

    const allParentsSnap = await usersCollection.where('role', '==', 'parent').get();
    const allParents = allParentsSnap.docs.map(doc => doc.data());
    
    const allStudentsSnap = await usersCollection.where('role', '==', 'student').get();
    const linkedParentIds = new Set(allStudentsSnap.docs.map(doc => doc.data().parentId).filter(Boolean));

    const unlinkedParents = allParents.filter(parent => !linkedParentIds.has(parent.uid));
    
    // --- DEBUG LOG ---
    console.log(`[Backend Log] Found ${unlinkedParents.length} unlinked parent(s).`);

    return unlinkedParents;
};

const linkParentToStudent = async (studentUid, parentUid) => {
    const studentRef = usersCollection.doc(studentUid);
    const studentDoc = await studentRef.get();
    if (!studentDoc.exists) throw new Error("Student not found.");
    
    const institutionId = studentDoc.data().institutionId;

    await studentRef.update({ parentId: parentUid });
    
    if (institutionId) {
        await usersCollection.doc(parentUid).update({ institutionId });
    }

    return { success: true, message: 'Parent linked successfully.' };
};

module.exports = {
    getStudentsByInstitution,
    getUnlinkedParents,
    linkParentToStudent,
};