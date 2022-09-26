import React, { useState, Fragment } from "react";

import { nanoid } from "nanoid";
import "./App.css";
import data from "./mock-data.json";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";

export default function App() {
  const [contacts, setContacts] = useState(data);

  const [addFormData, setAddFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: ""
  });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: ""
  });

  //the user isn't editing eny row = null
  const [editContactId, setEditContactId] = useState(null);
  //function that  gets called when user changes a value on any inputs
  const handleAddFormChange = (event) => {
    event.preventDefault();

    //get the name attribute the user has typed into(chnaged)
    const fieldName = event.target.getAttribute("name");
    //get the actual value the user has entered
    const fieldValue = event.target.value;

    //make a copy of the existing form data so we can change without mutating the state
    //change the value of an object = mutate the state
    //use spread operator to copy the exiting form data and asign new data
    const newFormData = { ...addFormData };
    //update the data with the new value the user has typed, update the value for a given field
    newFormData[fieldName] = fieldValue;
    //set it into state
    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };

  //gets called when the form is submitted
  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    //take the data stored in addFormData and create a new object
    const newContact = {
      id: nanoid(), //generate an id
      fullName: addFormData.fullName,
      address: addFormData.address,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email
    };
    //new contacts array to avoid mutating the state
    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
  };
  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    //new contact created
    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      address: editFormData.address,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email
    };
    const newContacts = [...contacts];
    //replace the contact object in the contacts array wih the new object created
    //find the index at contact id is equal to contact id (editContactId is the row we are editing)
    const index = contacts.findIndex((contact) => contact.id === editContactId);
    //update the array at the given possition
    newContacts[index] = editedContact;
    //set our contact id into state
    setContacts(newContacts);
    setEditContactId(null);
  };

  //when user clicks the edit button
  //accepts the contact because we need to know the id of the contact of that row
  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    //pre-populate it with contact data from that row when the user clicks the edit button
    const formValues = {
      fullName: contact.fullName,
      address: contact.address,
      phoneNumber: contact.phoneNumber,
      email: contact.email
    };
    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    //new contact is equal to a copy of the current contacts array as to not mutate the state
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === contactId);
    //use splice to remove the contact method at the given index in the array
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };

  return (
    <div className="app-container">
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/*  render either the editable row or the read-only row depending if we have an edit id or not */}
            {contacts.map((contact) => (
              <Fragment>
                {editContactId === contact.id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <form onSubmit={handleAddFormSubmit}>
        <h2>Add a Contact</h2>
        <input
          type="text"
          name="fullName"
          required="required"
          placeholder="Enter name"
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="address"
          required="required"
          placeholder="Enter address"
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Enter phone number"
          onChange={handleAddFormChange}
        />
        <input
          type="email"
          name="email"
          required="required"
          placeholder="Enter email"
          onChange={handleAddFormChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
