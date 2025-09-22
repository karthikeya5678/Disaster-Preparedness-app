const { db } = require('../config/firebase');
const contactsCollection = db.collection('emergencyContacts');

/**
 * Gets the list of emergency contacts, possibly filtered by institution.
 */
const getContacts = async (institutionId = null) => {
    let query = contactsCollection;
    if (institutionId) {
        // Assuming contacts are linked to an institution
        query = query.where('institutionId', '==', institutionId);
    }
    const snapshot = await query.orderBy('name').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Adds a new emergency contact.
 */
const addContact = async (contactData) => {
    const { name, phone, role, institutionId } = contactData;
    const newContact = { name, phone, role, institutionId };
    const docRef = await contactsCollection.add(newContact);
    return { id: docRef.id, ...newContact };
};

module.exports = {
    getContacts,
    addContact,
};