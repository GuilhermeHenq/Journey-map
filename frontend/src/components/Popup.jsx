import React from "react";
import styles from './Popup.module.css' 

function Popup(props) {
    return (props.trigger) ? (
        <div className={styles.popup}>
            <div className={styles.popupinner}>
                <button className={styles.closebtn} onClick={() => {props.setTrigger(false); props.setTextEdit(false)}}>&#10006;</button>
                { props.children }
            </div>
        </div>
    ) : "";
}

export default Popup