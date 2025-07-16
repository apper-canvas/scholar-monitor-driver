import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import { parentContactService } from "@/services/api/parentContactService";
import { toast } from "react-toastify";

const ParentContactModal = ({ student, onClose }) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [parentContact, setParentContact] = useState({
    phone: "",
    email: "",
    notes: ""
  });
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: "phone",
    subject: "",
    notes: "",
    outcome: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadParentContact();
  }, [student.Id]);

  const loadParentContact = async () => {
    try {
      setLoading(true);
      const contact = await parentContactService.getByStudentId(student.Id);
      if (contact) {
        setParentContact({
          phone: contact.phone || "",
          email: contact.email || "",
          notes: contact.notes || ""
        });
        setCommunications(contact.communications || []);
      }
    } catch (error) {
      toast.error("Failed to load parent contact information");
    } finally {
      setLoading(false);
    }
  };

  const validateContactForm = () => {
    const newErrors = {};
    
    if (!parentContact.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(parentContact.phone)) {
      newErrors.phone = "Phone must be in format (555) 123-4567";
    }
    
    if (!parentContact.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentContact.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCommunicationForm = () => {
    const newErrors = {};
    
    if (!newCommunication.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!newCommunication.notes.trim()) {
      newErrors.notes = "Notes are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveContact = async () => {
    if (!validateContactForm()) return;
    
    try {
      setSaving(true);
      await parentContactService.updateContact(student.Id, parentContact);
      toast.success("Parent contact information updated successfully");
    } catch (error) {
      toast.error("Failed to update parent contact information");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCommunication = async () => {
    if (!validateCommunicationForm()) return;
    
    try {
      setSaving(true);
      const communication = await parentContactService.addCommunication(student.Id, newCommunication);
      setCommunications(prev => [communication, ...prev]);
      setNewCommunication({
        type: "phone",
        subject: "",
        notes: "",
        outcome: ""
      });
      setShowAddCommunication(false);
      setErrors({});
      toast.success("Communication logged successfully");
    } catch (error) {
      toast.error("Failed to add communication");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCommunication = async (communicationId) => {
    if (!confirm("Are you sure you want to delete this communication?")) return;
    
    try {
      await parentContactService.deleteCommunication(student.Id, communicationId);
      setCommunications(prev => prev.filter(c => c.Id !== communicationId));
      toast.success("Communication deleted successfully");
    } catch (error) {
      toast.error("Failed to delete communication");
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setParentContact(prev => ({ ...prev, phone: formatted }));
  };

  const getCommunicationTypeIcon = (type) => {
    switch (type) {
      case "phone": return "Phone";
      case "email": return "Mail";
      case "meeting": return "Users";
      case "note": return "FileText";
      default: return "MessageSquare";
    }
  };

  const getCommunicationTypeBadge = (type) => {
    const variants = {
      phone: "info",
      email: "secondary",
      meeting: "success",
      note: "warning"
    };
    return variants[type] || "outline";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl mx-4">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-slate-600">Loading parent contact information...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Users" className="h-5 w-5 text-primary-600" />
            <span>Parent Contact - {student.firstName} {student.lastName}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("contact")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "contact"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <ApperIcon name="User" className="h-4 w-4 mr-2 inline" />
                Contact Information
              </button>
              <button
                onClick={() => setActiveTab("communications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "communications"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <ApperIcon name="MessageSquare" className="h-4 w-4 mr-2 inline" />
                Communication Log
                {communications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {communications.length}
                  </Badge>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Parent Phone Number"
                    id="phone"
                    error={errors.phone}
                  >
                    <Input
                      id="phone"
                      type="tel"
                      value={parentContact.phone}
                      onChange={handlePhoneChange}
                      placeholder="(555) 123-4567"
                      maxLength={14}
                    />
                  </FormField>
                  
                  <FormField
                    label="Parent Email"
                    id="email"
                    error={errors.email}
                  >
                    <Input
                      id="email"
                      type="email"
                      value={parentContact.email}
                      onChange={(e) => setParentContact(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="parent@example.com"
                    />
                  </FormField>
                </div>
                
                <FormField
                  label="Parent Notes"
                  id="notes"
                  error={errors.notes}
                >
                  <textarea
                    id="notes"
                    rows={4}
                    value={parentContact.notes}
                    onChange={(e) => setParentContact(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the parent or communication preferences..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </FormField>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveContact}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                        Save Contact
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "communications" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-slate-900">Communication History</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowAddCommunication(true)}
                  >
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Communication
                  </Button>
                </div>

                {showAddCommunication && (
                  <Card className="bg-slate-50">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Communication Type"
                            id="type"
                            error={errors.type}
                          >
                            <Select
                              id="type"
                              value={newCommunication.type}
                              onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value }))}
                            >
                              <option value="phone">Phone Call</option>
                              <option value="email">Email</option>
                              <option value="meeting">In-Person Meeting</option>
                              <option value="note">General Note</option>
                            </Select>
                          </FormField>
                          
                          <FormField
                            label="Subject"
                            id="subject"
                            error={errors.subject}
                          >
                            <Input
                              id="subject"
                              value={newCommunication.subject}
                              onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                              placeholder="Brief subject or topic"
                            />
                          </FormField>
                        </div>
                        
                        <FormField
                          label="Notes"
                          id="notes"
                          error={errors.notes}
                        >
                          <textarea
                            id="notes"
                            rows={3}
                            value={newCommunication.notes}
                            onChange={(e) => setNewCommunication(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Detailed notes about the communication..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </FormField>
                        
                        <FormField
                          label="Outcome (Optional)"
                          id="outcome"
                        >
                          <Input
                            id="outcome"
                            value={newCommunication.outcome}
                            onChange={(e) => setNewCommunication(prev => ({ ...prev, outcome: e.target.value }))}
                            placeholder="Next steps or resolution"
                          />
                        </FormField>
                        
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowAddCommunication(false);
                              setNewCommunication({
                                type: "phone",
                                subject: "",
                                notes: "",
                                outcome: ""
                              });
                              setErrors({});
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleAddCommunication}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Adding...
                              </>
                            ) : (
                              <>
                                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                                Add Communication
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {communications.length === 0 ? (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageSquare" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No communications yet</h3>
                      <p className="text-slate-500 mb-4">
                        Start tracking your interactions with {student.firstName}'s parents.
                      </p>
                      <Button
                        onClick={() => setShowAddCommunication(true)}
                        size="sm"
                      >
                        <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                        Add First Communication
                      </Button>
                    </div>
                  ) : (
                    communications.map((communication) => (
                      <Card key={communication.Id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <ApperIcon 
                                  name={getCommunicationTypeIcon(communication.type)} 
                                  className="h-5 w-5 text-primary-600" 
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-medium text-slate-900">
                                    {communication.subject}
                                  </h4>
                                  <Badge variant={getCommunicationTypeBadge(communication.type)}>
                                    {communication.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">
                                  {communication.notes}
                                </p>
                                {communication.outcome && (
                                  <p className="text-sm text-slate-500 italic">
                                    <strong>Outcome:</strong> {communication.outcome}
                                  </p>
                                )}
                                <p className="text-xs text-slate-400 mt-2">
                                  {new Date(communication.date).toLocaleDateString()} at {new Date(communication.date).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCommunication(communication.Id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <ApperIcon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentContactModal;