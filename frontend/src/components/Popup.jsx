import React from "react";
import styles from './Popup.module.css' 

function Popup(props) {
    return (props.trigger) ? (
        <div className={styles.popup}>
            <div className={styles.popup-inner}>
                <button className="close-btn" onClick={() => props.setTrigger(false)}>&#10006;</button>
                { props.children }
            </div>
        </div>
    ) : "";
}

export default Popup