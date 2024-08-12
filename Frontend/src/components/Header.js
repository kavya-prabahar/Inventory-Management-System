import React from 'react';
import '../styles/Header.css'; 
import imageSrc from '../images/master-edited-03.png'; 

const Header = () => {
    return (
        <header className='header'>
            <div class = "content">
            <h2 className='heading'>
                Hey there! <br></br>Welcome to InvenTrack!
            </h2>
            <p className='heading-content'>
            <b><i>InvenTrack</i></b> is an inventory management system
            designed to streamline stock and sales tracking.
            Admins can update inventory levels and view
            detailed sales reports, while sales personnel
            have the capability to record new sales entries.
            </p>
            </div>

            <div className='image'>
                <img className = "ims" src={imageSrc} alt='Inventory System' />
            </div>

  
        </header>
    );
};

export default Header;
