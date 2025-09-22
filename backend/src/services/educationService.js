const { db } = require('../config/firebase');
const modulesCollection = db.collection('educationModules');

// This function now contains badge names and icon URLs for each course.
async function seedDefaultModules() {
    console.log("--- Seeding database with CORRECT S3 filenames ---");
    const defaultModules = [
        // MODULE 1: FIRE SAFETY (NEW)
        {
            title: 'Fire Evacuation Plan',
            description: 'Learn the critical steps for safely evacuating during a fire emergency.',
            imageUrl: 'https://placehold.co/600x400/FCA5A5/7F1D1D?text=Fire+Safety',
            badgeName: 'Fire Safety Certified',
            badgeIconUrl: 'https://placehold.co/100x100/7F1D1D/FCA5A5?text=🔥',
            lessons: [
                { id: 1, title: 'Introduction to Fire Safety', type: 'video', content: 'fire.mp4' }, // CORRECT FILENAME
                { id: 2, title: 'Creating an Escape Route', type: 'text', content: 'Every room should have two ways out. Keep escape routes clear of clutter.' },
                { 
                    id: 3, 
                    title: 'Fire Safety Quiz', 
                    type: 'quiz', 
                    content: 'Test your fire safety knowledge.',
                    questions: [
                        { q: 'What should you do if your clothes catch fire?', options: ['Run to find water', 'Stop, Drop, and Roll', 'Wave your arms'], answer: 'Stop, Drop, and Roll' }
                    ]
                }
            ]
        },
        // MODULE 2: FLOOD PREPAREDNESS (UPDATED)
        {
            title: 'Flood Preparedness Guide',
            description: 'Essential guide for staying safe in flood-prone areas.',
            imageUrl: 'https://placehold.co/600x400/BFDBFE/1E3A8A?text=Flood+Preparedness',
            badgeName: 'Flood Ready',
            badgeIconUrl: 'https://placehold.co/100x100/1E3A8A/BFDBFE?text=🌊',
            lessons: [
                { id: 1, title: 'Understanding Flood Risks', type: 'video', content: 'flood.mp4' }, // CORRECT FILENAME
                { id: 2, title: 'Assembling a Flood Kit', type: 'text', content: 'Your kit should include waterproof bags for important documents and a battery-powered radio.' },
                { 
                    id: 3, 
                    title: 'Quiz: Are You Prepared?', 
                    type: 'quiz', 
                    content: 'Take this short quiz to see if you are ready for a flood.',
                    questions: [
                        { q: 'Is it safe to drive through moving water during a flood?', options: ['Yes, in a big car', 'No, never', 'Only if it looks shallow'], answer: 'No, never' }
                    ]
                }
            ]
        },
        // MODULE 3: CYCLONE SAFETY (NEW)
        {
            title: 'Cyclone & High Wind Safety',
            description: 'Learn how to prepare for and stay safe during a cyclone or severe wind event.',
            imageUrl: 'https://placehold.co/600x400/A5F3FC/0E7490?text=Cyclone+Safety',
            badgeName: 'Cyclone Survivor',
            badgeIconUrl: 'https://placehold.co/100x100/0E7490/A5F3FC?text=🌪️',
            lessons: [
                { id: 1, title: 'Preparing for a Cyclone', type: 'video', content: 'cyclone.mp4' }, // CORRECT FILENAME
                { id: 2, title: 'Securing Your Home', type: 'text', content: 'Board up windows and bring loose objects, like garden furniture, inside.' },
                { 
                    id: 3, 
                    title: 'Cyclone Knowledge Quiz', 
                    type: 'quiz', 
                    content: 'Test your cyclone preparedness.',
                    questions: [
                        { q: 'Where is the safest place to shelter during a cyclone?', options: ['In a car', 'An interior room with no windows', 'Under a large tree'], answer: 'An interior room with no windows' }
                    ]
                }
            ]
        }
    ];

    // This code ensures the database is reset with the new, correct data.
    const snapshot = await modulesCollection.get();
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    const addPromises = defaultModules.map(module => modulesCollection.add(module));
    await Promise.all(addPromises);
}

const getModules = async () => {
    const snapshot = await modulesCollection.orderBy('title').get();
    if (snapshot.empty) {
        await seedDefaultModules();
        const retrySnapshot = await modulesCollection.orderBy('title').get();
        return retrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getModuleById = async (moduleId) => {
    const doc = await modulesCollection.doc(moduleId).get();
    if (!doc.exists) { throw new Error("Module not found"); }
    return { id: doc.id, ...doc.data() };
};

// --- Your other functions for the CMS ---
const createModule = async (moduleData) => { /* ... */ };
const updateModule = async (moduleId, moduleData) => { /* ... */ };
const deleteModule = async (moduleId) => { /* ... */ };

module.exports = {
    getModules,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
};