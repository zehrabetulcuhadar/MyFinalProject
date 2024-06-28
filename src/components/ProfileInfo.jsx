import React, { useState, useEffect } from 'react';
import { auth, db } from './../firebaseConfig'; 
import { doc, getDoc, updateDoc, deleteDoc, collection, query, getDocs } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; 
import { updatePassword, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "./../assets/styles/ProfileInfo.css";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

const ProfileInfo = ({ userId }) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    email: '',
    profilePicture: '',
    hasProfilePicture: false, 
    newPassword: '', 
    currentPassword: ''
  });

  const defaultProfilePictureUrl = '/user.png';
  const [isEditing, setIsEditing] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [editSection, setEditSection] = useState('');

  const showToast = (message, type = "info") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("Dosya seçilmedi");
      return;
    }
    const storage = getStorage();
    const userImageRef = storageRef(storage, `profilePictures/${userId}`);

    try {
      const snapshot = await uploadBytes(userImageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      const userProfileRef = doc(db, 'users', userId, 'profile', documentId);
      await updateDoc(userProfileRef, {
        profilePicture: photoURL
      });
      setUserInfo({ ...userInfo, profilePicture: photoURL, hasProfilePicture: true });
      console.log("Profil fotoğrafı başarıyla yüklendi ve güncellendi!");
    } catch (error) {
      console.error("Profil fotoğrafı yükleme hatası:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided');
      return;
    }

    const fetchUserProfile = async () => {
      const profileCollectionRef = collection(db, 'users', userId, 'profile');
      const profileQuery = query(profileCollectionRef);
      const profileSnapshot = await getDocs(profileQuery);

      if (!profileSnapshot.empty) {
        const docId = profileSnapshot.docs[0].id;
        setDocumentId(docId);

        const userProfileRef = doc(db, 'users', userId, 'profile', docId);
        const docSnap = await getDoc(userProfileRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserInfo({
            ...userData,
            hasProfilePicture: !!userData.profilePicture
          });
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No profile documents found!');
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleProfilePictureChange = (event) => {
    handleProfilePictureUpload(event);
    setUserInfo(prevState => ({
      ...prevState,
      hasProfilePicture: true
    }));
  };

  const handleRemoveProfilePicture = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const storage = getStorage();
        const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
        
        // Dosyanın var olup olmadığını kontrol et
        await getDownloadURL(profilePicRef);

        await deleteObject(profilePicRef);
  
        const userProfileRef = doc(db, 'users', user.uid, 'profile', documentId);
        await updateDoc(userProfileRef, {
          profilePicture: defaultProfilePictureUrl
        });
  
        setUserInfo({ ...userInfo, profilePicture: defaultProfilePictureUrl, hasProfilePicture: false });
        showToast('Profil resmi başarıyla kaldırıldı.', 'success');
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          console.log('Profil resmi bulunamadı, zaten kaldırılmış.');
          showToast('Profil resmi bulunamadı.', 'info');
        } else {
          console.error("Profil resmi silme hatası:", error);
          showToast("Profil resmi silme hatası: " + error.message, 'error');
        }
      }
    }
  };

  const handleSaveUserInfo = async () => {
    const userProfileRef = doc(db, 'users', userId, 'profile', documentId);
    try {
      await updateDoc(userProfileRef, {
        name: userInfo.name,
        surname: userInfo.surname
      });
      showToast('Kullanıcı adı başarıyla güncellendi.', 'success');
      setIsEditing(false);
      setEditSection('');
    } catch (error) {
      showToast("Güncelleme sırasında bir hata oluştu: " + error.message, 'error');
    }
  };

  const handleSavePassword = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const credentials = EmailAuthProvider.credential(user.email, userInfo.currentPassword);
    try {
      await reauthenticateWithCredential(user, credentials);

      if (userInfo.newPassword) {
        await updatePassword(user, userInfo.newPassword);
        showToast('Şifre başarıyla güncellendi.', 'success');
      }

      setIsEditing(false);
      setEditSection('');
    } catch (error) {
      showToast("Güncelleme sırasında bir hata oluştu. Mevcut şifre yanlış: " + error.message, 'error');
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      showToast("Çıkış yapıldı", 'info');
      navigate('/');
    }).catch((error) => {
      showToast("Çıkış yapma hatası: " + error.message, 'error');
    });
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: 'Hesabı Silmek İstediğinizden Emin Misiniz?',
      text: "Bu işlemi geri alamazsınız!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal',
      input: 'password',
      inputPlaceholder: 'Mevcut Şifrenizi Girin',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      preConfirm: async (password) => {
        if (!password) {
          Swal.showValidationMessage('Mevcut şifre gerekli');
          return;
        }

        const user = auth.currentUser;
        const credentials = EmailAuthProvider.credential(user.email, password);
        try {
          await reauthenticateWithCredential(user, credentials);
          return true;
        } catch (error) {
          Swal.showValidationMessage('Mevcut şifre yanlış');
          return false;
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const user = auth.currentUser;
        if (!user) {
          Swal.fire(
            'Hata',
            'Kullanıcı bilgisi bulunamadı.',
            'error'
          );
          return;
        }
    
        const storage = getStorage();
        const userProfileRef = doc(db, 'users', user.uid, 'profile', documentId);
        const profilePicPath = `profilePictures/${user.uid}`;
        const profilePicRef = storageRef(storage, profilePicPath);
    
        try {
          if (userInfo.profilePicture && userInfo.profilePicture !== defaultProfilePictureUrl) {
            await deleteObject(profilePicRef);
          }
    
          await deleteDoc(userProfileRef);
    
          await deleteUser(user);
          
          Swal.fire(
            'Başarılı!',
            'Hesabınız başarıyla silindi.',
            'success'
          );
          navigate('/');
        } catch (error) {
          console.error("Hesap silme hatası:", error);
          Swal.fire(
            'Hata',
            'Hesap silme hatası: ' + error.message,
            'error'
          );
          navigate('/');
        }
      }
    });
  };

  const renderProfilePictureEditSection = () => {
    return (
      <div className="edit-section">
        {isEditing && editSection === 'profilePicture' && (
          <div className='edit-profile-picture'>
            {userInfo.hasProfilePicture && (
              <img src={userInfo.profilePicture} alt="Profile" className="profile-picture" />
            )}
            <div className="buttons">
              <label className="file-input">
                Dosya Seç
                <input type="file" onChange={handleProfilePictureChange} />
              </label>
              <button onClick={handleRemoveProfilePicture} className="btn btn-danger">Profil Resmini Kaldır</button>
              <button onClick={() => setEditSection('')} className="btn btn-secondary">İptal</button>
            </div>
          </div>
        )}
        {!isEditing && (
          <img src={userInfo.profilePicture || defaultProfilePictureUrl} alt="Profile" className="profile-picture" />
        )}
      </div>
    );
  };

  const renderUsernameEditSection = () => {
    return (
      <div className="edit-section">
        {isEditing && editSection === 'username' && (
          <>
            <input type="text" name="name" placeholder="Ad" value={userInfo.name} onChange={handleChange} className="form-control mb-2" />
            <input type="text" name="surname" placeholder="Soyad" value={userInfo.surname} onChange={handleChange} className="form-control mb-2" />
            <button onClick={handleSaveUserInfo} className="btn btn-success me-2">Kaydet</button>
            <button onClick={() => setEditSection('')} className="btn btn-secondary">İptal</button>
          </>
        )}
      </div>
    );
  };

  const renderPasswordEditSection = () => {
    return (
      <div className="edit-section">
        {isEditing && editSection === 'password' && (
          <>
            <input type="password" name="currentPassword" placeholder="Mevcut Şifre" value={userInfo.currentPassword || ''} onChange={handleChange} className="form-control mb-2" />
            <input type="password" name="newPassword" placeholder="Yeni Şifre" value={userInfo.newPassword || ''} onChange={handleChange} className="form-control mb-2" />
            <button onClick={handleSavePassword} className="btn btn-success me-2">Kaydet</button>
            <button onClick={() => setEditSection('')} className="btn btn-secondary">İptal</button>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="profile-page">
      <ToastContainer />
      <div className={`profile-container ${isEditing ? 'editing' : ''}`}>
        {renderProfilePictureEditSection()}
        {!isEditing ? (
          <div className="user-details">
            <h2>{`${userInfo.name} ${userInfo.surname}`}</h2>
            <p>Email: {userInfo.email}</p>
          </div>
        ) : (
          <>
            {editSection === '' && (
              <div className="edit-buttons">
                <button onClick={() => setEditSection('profilePicture')} className="btn btn-primary me-2">Profil Resmini Düzenle</button>
                <button onClick={() => setEditSection('username')} className="btn btn-primary me-2">Kullanıcı Adını Düzenle</button>
                <button onClick={() => setEditSection('password')} className="btn btn-primary me-2">Şifre Güncelle</button>
                <button onClick={() => { setIsEditing(false); setEditSection(''); }} className="btn btn-secondary">Geri</button>
              </div>
            )}
            {renderUsernameEditSection()}
            {renderPasswordEditSection()}
          </>
        )}
      </div>
      <div className="user-actions">
        {!isEditing && (
          <>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary me-2">Hesabı Düzenle</button>
            <button onClick={handleDeleteAccount} className="btn btn-danger">Hesabı Sil</button>
            <button onClick={handleSignOut} className="btn btn-warning">Çıkış Yap</button>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileInfo