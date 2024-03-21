import React, { useState, useEffect, useCallback  } from 'react';
import { db } from '../firebaseConfig'; 
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
} from 'firebase/firestore';
import DashboardNavbar from '../components/DashboardNavbar';
import "./../assets/styles/Notes.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Row, Col, FormControl  } from 'react-bootstrap';
import { useParams, useNavigate  } from 'react-router-dom';


const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();


 // Kullanıcının notlar koleksiyonuna referans. Örneğin: 'users/{userId}/notes'
  const userNotesRef = collection(db, "users", userId, "notes");

  const fetchNotes = useCallback(async () => {
    const q = query(userNotesRef);
    const querySnapshot = await getDocs(q);
    setNotes(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [userNotesRef]); // fetchNotes fonksiyonunun bağımlılıkları

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchNotes();
  }, [userId, navigate, fetchNotes]);

  const handleNoteSubmit = async () => {
    const note = {
      title: noteTitle,
      text: currentNote,
      date: noteDate || new Date().toISOString().split('T')[0], // Eğer tarih girilmediyse bugünün tarihi kullanılacak
    };
    if (editingNoteId) {
      const noteDocRef = doc(userNotesRef, editingNoteId);
      await updateDoc(noteDocRef, note);
    } else {
      await addDoc(userNotesRef, note);
    }
    setEditingNoteId(null);
    setNoteTitle("");
    setCurrentNote("");
    setNoteDate("");
    fetchNotes();
  };

  const startEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setCurrentNote(note.text);
    setNoteDate(note.date);
  };

  const deleteNote = async (id) => {
    const noteDoc = doc(userNotesRef, id);
    await deleteDoc(noteDoc);
    fetchNotes();
  };

  return (
    <div className="notes-container">
      <DashboardNavbar />
      <Container className="my-4">
        <Row>
          <Col lg={6} md={12} className="notes-input-area mb-3">
            <FormControl
              placeholder="Başlık"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="mb-2"
            />
            <FormControl
              as="textarea"
              placeholder="Notunuzu buraya girin..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              className="mb-2"
            />
            <FormControl
              type="date"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              className="mb-2"
            />
            <Button variant={editingNoteId ? "primary" : "success"} onClick={handleNoteSubmit}>
              {editingNoteId ? "Notu Güncelle" : "Not Ekle"}
            </Button>
          </Col>
          <Col lg={6} md={12} className="notes-display-area">
            {notes.map((note) => (
              <Card key={note.id} className="note-card mb-2">
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.text}</Card.Text>
                  <Card.Footer>{note.date}</Card.Footer>
                  <Button variant="warning" onClick={() => startEditNote(note)} className="me-2">
                    Düzenle
                  </Button>
                  <Button variant="danger" onClick={() => deleteNote(note.id)}>
                    Sil
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Notes