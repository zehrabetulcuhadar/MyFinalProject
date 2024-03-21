import React from 'react'
import './../assets/styles/CopyrightBar.css';

const CopyrightBar = () => {
  return (
    <div className="copyright-bar">
        &copy; {new Date().getFullYear()} Şirket Adı. Tüm hakları saklıdır.
    </div>
  )
}

export default CopyrightBar