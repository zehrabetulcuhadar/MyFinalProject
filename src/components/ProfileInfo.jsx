import React, { useState, useEffect } from 'react';
import { auth, db } from './../firebaseConfig'; 
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; 
import { updatePassword, signOut, deleteUser } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "./../assets/styles/ProfileInfo.css";
import { toast } from 'react-toastify';

const ProfileInfo = ({ userId }) => {
  const navigate = useNavigate();

  // Giriş yapan kullanıcının bilgilerini Firebase'den al
  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    email: '',
    profilePicture: '', // Profil fotoğrafı URL'si
    hasProfilePicture: false, // Profil fotoğrafı olup olmadığını kontrol etmek için
    newPassword: '', // Yeni şifre için alan
    currentPassword: '' // Mevcut şifreyi doğrulama için alan (eğer gerekirse)
  });

  const defaultProfilePictureUrl = '/user.png';

  // Kullanıcının düzenleme modunda olup olmadığını takip eden state
  const [isEditing, setIsEditing] = useState(false);

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
      // Firestore'da kullanıcının profil bilgilerini güncelle
      const userProfileRef = doc(db, 'users', userId, 'profile', 'profileDocument');
      await updateDoc(userProfileRef, {
        profilePicture: photoURL
      });
      setUserInfo({ ...userInfo, profilePicture: photoURL });
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
    const userDocRef = doc(db, 'users', userId, 'profile', 'profileDocument');
  
    getDoc(userDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserInfo(prevState => ({
          ...prevState,
          ...userData,
          hasProfilePicture: !!userData.profilePicture // Eğer profil resmi URL'si varsa, true değerini ata
        }));
      } else {
        console.log('No such document!');
      }
    }).catch(error => {
      console.error('Error fetching user document:', error);
    });
  }, [userId]);
    
  // Input alanlarındaki değişiklikleri işleyen fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleProfilePictureChange = (event) => {
    // ... Profil fotoğrafı yükleme işlemleri
    handleProfilePictureUpload(event);
    // Yükleme başarılı olduktan sonra
    setUserInfo(prevState => ({
      ...prevState,
      hasProfilePicture: true
    }));
  };

  const handleRemoveProfilePicture = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Firebase Storage'dan profil resmini sil
        const storage = getStorage();
        const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
        await deleteObject(profilePicRef); // Bu kısım Firebase Storage'dan resmi siler
  
        // Firestore'daki kullanıcı profilinden profil resmi URL'sini sil veya varsayılan URL'ye ayarla
        const userProfileRef = doc(db, 'users', user.uid, 'profile', 'profileDocument');
        await updateDoc(userProfileRef, {
          profilePicture: defaultProfilePictureUrl // Varsayılan profil resmi URL'si veya boş string
        });
  
        // Kullanıcı bilgilerini güncelle
        setUserInfo({ ...userInfo, profilePicture: defaultProfilePictureUrl, hasProfilePicture: false });
        showToast('Profil resmi başarıyla kaldırıldı.', 'success');
      } catch (error) {
        console.error("Profil resmi silme hatası:", error);
        showToast("Profil resmi silme hatası: " + error.message, 'error');
      }
    }
  };

  // Kullanıcı düzenleme moduna girdiğinde yeni profil fotoğrafı seçebilsin diye bir input alanı gösterilecek
  const renderProfilePictureEditSection = () => {
    return (
      <>
        {isEditing && (
          <>
            <input type="file" onChange={handleProfilePictureChange} />
            {/* Yüklenmiş bir resim varsa göster */}
            {userInfo.hasProfilePicture && (
              <img src={userInfo.profilePicture} alt="Profile" className="profile-picture"/>
            )}
            {/* Profil resmi kaldırma butonu */}
            <button onClick={handleRemoveProfilePicture} className="btn btn-danger">Profil Resmini Kaldır</button>
          </>
        )}
        {!isEditing && (
          <img src={userInfo.profilePicture || defaultProfilePictureUrl} alt="Profile" className="profile-picture"/>
        )}
      </>
    );
  };


  // Düzenlemeleri kaydeden fonksiyon
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      // Firestore'da kullanıcının profil bilgilerini güncelle
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'profileDocument');
      try {
        await updateDoc(userProfileRef, {
          name: userInfo.name,
          surname: userInfo.surname,
          email: userInfo.email,
          // profilePicture alanını da burada güncelleyebilirsiniz
        });

        // Eğer şifre alanı doluysa, kullanıcının şifresini güncelle
        if (userInfo.newPassword) {
          await updatePassword(user, userInfo.newPassword);
          showToast('Bilgiler ve şifre başarıyla güncellendi.', 'success');
        } else {
          showToast('Bilgiler başarıyla güncellendi.', 'success');
        }

        // Düzenleme modunu kapat
        setIsEditing(false);
      } catch (error) {
        console.error("Profil güncelleme hatası", error);
        showToast("Profil güncelleme hatası: " + error.message, 'error');
      }
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
    const confirm = window.confirm("Hesabı silmek istediğinizden emin misiniz?");
    if (confirm) {
      const user = auth.currentUser;
      if (!user) {
        alert('Kullanıcı bilgisi bulunamadı.');
        return;
      }
  
      const storage = getStorage();
      const userProfileRef = doc(db, 'users', user.uid);
      const profilePicPath = `profilePictures/${user.uid}`;
      const profilePicRef = storageRef(storage, profilePicPath);
  
      try {
        // Profil resmini silme işlemi
        if (userInfo.profilePicture && userInfo.profilePicture !== defaultProfilePictureUrl) {
          await deleteObject(profilePicRef);
        }
  
        // Firestore'dan kullanıcı verilerini sil
        await deleteDoc(userProfileRef);
  
        // Firebase Authentication'dan kullanıcıyı sil
        await deleteUser(user);
        
        // Kullanıcıya uyarı göster ve anasayfaya yönlendir
        showToast("Hesabınız başarıyla silindi.", 'success');
        navigate('/');
      } catch (error) {
        console.error("Hesap silme hatası:", error);
        showToast("Hesap silme hatası: " + error.message, 'error');
        // Kullanıcıyı anasayfaya yönlendir
        navigate('/');
      }
    }
  };
 
  

  return (
    <div className="profile-page">
      <div className="profile-container">
      {renderProfilePictureEditSection()}
        {!isEditing ? (
          <div className="user-details">
            <h2>{`${userInfo.name} ${userInfo.surname}`}</h2>
            <p>Email: {userInfo.email}</p>
          </div>
        ) : (
          <div className="user-details">
            <input type="text" name="name" placeholder="Name" value={userInfo.name} onChange={handleChange} className="form-control mb-2" />
            <input type="text" name="surname" placeholder="Surname" value={userInfo.surname} onChange={handleChange} className="form-control mb-2" />
            <input type="email" name="email" placeholder="Email" value={userInfo.email} onChange={handleChange} className="form-control mb-2" />
            <input type="password" name="password" placeholder="New Password" value={userInfo.password} onChange={handleChange} className="form-control mb-2" />
            <button onClick={handleSave} className="btn btn-success me-2">Kaydet</button>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">İptal</button>
          </div>
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