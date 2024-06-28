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
import Swal from 'sweetalert2';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const { userId } = useParams();
  const navigate = useNavigate();
  const MAX_TITLE_LENGTH = 50;  // Not başlığı için maksimum karakter sınırlaması
  const MAX_NOTE_LENGTH = 500;  // Not metni için maksimum karakter sınırlaması
  const MAX_PREVIEW_LENGTH = 200; // not önizlemesi için kullanılan max karakter 


  const userNotesRef = collection(db, "users", userId, "notes");

  const fetchNotes = useCallback(async () => {
    const q = query(userNotesRef);
    const querySnapshot = await getDocs(q);
    setNotes(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [userNotesRef]); 

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchNotes();
  }, [userId, navigate, fetchNotes]);

  const handleNoteSubmit = async () => {
    if (!noteTitle.trim() || !currentNote.trim()) {
      Swal.fire('Hata', 'Not başlığı ve içeriği boş bırakılamaz!', 'error');
      return;
    }
  
    const note = {
      title: noteTitle,
      text: currentNote,
      date: noteDate || new Date().toISOString().split('T')[0],
    };
  
    try {
      if (editingNoteId) {
        const noteDocRef = doc(db, `users/${userId}/notes`, editingNoteId);
        await updateDoc(noteDocRef, note);
        Swal.fire('Başarılı', 'Not başarıyla güncellendi!', 'success');
      } else {
        await addDoc(userNotesRef, note);
        Swal.fire('Başarılı', 'Not başarıyla eklendi!', 'success');
      }
      fetchNotes();
    } catch (error) {
      console.error("Not işlemi sırasında bir hata oluştu:", error);
      Swal.fire('Hata', 'Not işlemi başarısız!', 'error');
    } finally {
      setEditingNoteId(null);
      setNoteTitle("");
      setCurrentNote("");
      setNoteDate("");
    }
  };
  
  const deleteNote = async (id) => {
    if (!id) return;
    Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu notu silmek istediğinizden emin misiniz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!'
    }).then((result) => {
      if (result.isConfirmed) {
        const noteDocRef = doc(db, `users/${userId}/notes`, id);
        deleteDoc(noteDocRef)
          .then(() => {
            fetchNotes();
            Swal.fire(
              'Silindi!',
              'Not başarıyla silindi.',
              'success'
            );
          })
          .catch((error) => {
            console.error("Not silinirken bir hata oluştu:", error);
            Swal.fire('Hata', 'Not silinemedi!', 'error');
          });
      }
    });
  };

  const startEditNote = (note) => {
    if (!note) return;
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setCurrentNote(note.text);
    setNoteDate(note.date);
  };
  
  const toggleNoteExpansion = (noteId) => {
    setExpandedNotes(prevState => ({
      ...prevState,
      [noteId]: !prevState[noteId]
    }));
  };

  const renderNoteText = (note) => {
    if (note.text.length > MAX_PREVIEW_LENGTH && !expandedNotes[note.id]) {
      return (
        <>
          {note.text.substring(0, MAX_PREVIEW_LENGTH)}...
          <Button variant="link" onClick={() => toggleNoteExpansion(note.id)}>Devamını Oku</Button>
        </>
      );
    }
    return note.text;
  };

  
  return (
    <div>
      <DashboardNavbar />
      <div className="notes-container">
        <Container className="my-4">
          <Row>
            <Col lg={6} md={12} className="notes-input-area mb-3">
              <FormControl
                placeholder="Başlık"
                maxLength={MAX_TITLE_LENGTH}
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="mb-2"
              />
              <FormControl
                as="textarea"
                placeholder="Notunuzu buraya girin..."
                maxLength={MAX_NOTE_LENGTH}
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
                    <Card.Text>{renderNoteText(note)}</Card.Text>
                    <Card.Footer>{note.date}</Card.Footer>
                    <Button variant="warning" className="me-2" onClick={() => startEditNote(note)}>Düzenle</Button>
                    <Button variant="danger" onClick={() => deleteNote(note.id)}>Sil</Button>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Notes