import parentContactsData from "@/services/mockData/parentContacts.json";

let parentContacts = [...parentContactsData];

export const parentContactService = {
  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = parentContacts.find(pc => pc.studentId === parseInt(studentId));
    return contact ? { ...contact } : null;
  },

  async updateContact(studentId, contactData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = parentContacts.findIndex(pc => pc.studentId === parseInt(studentId));
    
    if (index !== -1) {
      parentContacts[index] = {
        ...parentContacts[index],
        ...contactData,
        updatedAt: new Date().toISOString()
      };
      return { ...parentContacts[index] };
    } else {
      // Create new parent contact record
      const maxId = Math.max(...parentContacts.map(pc => pc.Id), 0);
      const newContact = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        ...contactData,
        communications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      parentContacts.push(newContact);
      return { ...newContact };
    }
  },

  async addCommunication(studentId, communicationData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const contactIndex = parentContacts.findIndex(pc => pc.studentId === parseInt(studentId));
    
    if (contactIndex !== -1) {
      const contact = parentContacts[contactIndex];
      const maxCommId = Math.max(...contact.communications.map(c => c.Id), 0);
      
      const newCommunication = {
        Id: maxCommId + 1,
        ...communicationData,
        date: new Date().toISOString(),
        createdBy: "Current User" // In a real app, this would be the logged-in user
      };
      
      contact.communications.unshift(newCommunication);
      contact.updatedAt = new Date().toISOString();
      
      return { ...newCommunication };
    } else {
      // Create new parent contact with communication
      const maxId = Math.max(...parentContacts.map(pc => pc.Id), 0);
      const newCommunication = {
        Id: 1,
        ...communicationData,
        date: new Date().toISOString(),
        createdBy: "Current User"
      };
      
      const newContact = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        phone: "",
        email: "",
        notes: "",
        communications: [newCommunication],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      parentContacts.push(newContact);
      return { ...newCommunication };
    }
  },

  async deleteCommunication(studentId, communicationId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contactIndex = parentContacts.findIndex(pc => pc.studentId === parseInt(studentId));
    
    if (contactIndex !== -1) {
      const contact = parentContacts[contactIndex];
      const commIndex = contact.communications.findIndex(c => c.Id === parseInt(communicationId));
      
      if (commIndex !== -1) {
        const deleted = contact.communications.splice(commIndex, 1)[0];
        contact.updatedAt = new Date().toISOString();
        return { ...deleted };
      }
    }
    return null;
  },

  async getCommunications(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = parentContacts.find(pc => pc.studentId === parseInt(studentId));
    return contact ? [...contact.communications] : [];
  }
};