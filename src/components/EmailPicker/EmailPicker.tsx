import React, {useEffect, useState} from "react";

import clsx from "clsx";

import styles from './EmailPicker.module.scss'


const isEmail = (email:string) => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
}
interface EmailPickerProps {
    items: Array<string>
    setItems: React.Dispatch<React.SetStateAction<string[]>>
    getLocalizedString: (key:string)=>string
    onChange: (items:Array<string>)=>void
}

const EmailPicker = ({items,setItems,getLocalizedString,onChange}:EmailPickerProps)=>{
    const [value, setValue] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        onChange(items)
    },[items])

    const isInList = (email:string) => {
        return items.includes(email);
    }

    const isValid = (email:string) => {
        let error = null;

        if (isInList(email)) {
            error = `${email} ${getLocalizedString('hasAlreadyAdded')}`;
        }

        if (!isEmail(email)) {
            error = `${email} ${getLocalizedString('isNotValidEmail')}`;
        }

        if (error) {
            setError(error);

            return false;
        }

        return true;
    }

    const handleKeyDown = (evt: { key: string; preventDefault: () => void; }) => {
        if (["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();

            const formattedValue = value.trim();

            if (formattedValue && isValid(formattedValue)) {
                setItems((prev)=>[...prev, value])
                setValue('')
            }
        }
    };

    const handleChange = (evt:any) => {
        setValue(evt.target.value)
        setError(null)
    };

    const handleDelete = (item: any) => {
        setItems((prev)=>prev.filter(i => i !== item))
    };

    const handlePaste = (evt: { preventDefault: () => void; clipboardData: { getData: (arg0: string) => any; }; }) => {
        evt.preventDefault();

        const paste = evt.clipboardData.getData("text");
        const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

        if (emails) {
            const toBeAdded = emails.filter((email: any) => !isInList(email));
            setItems([...items, ...toBeAdded])
        }
    };



    return(
        <div style={{width:"50%"}}>
            <>
                {items.map(item => (
                    <div className={styles.tagItem} key={item}>
                        {item}
                        <button
                            type="button"
                            className={styles.tagItemButton}
                            onClick={() => handleDelete(item)}
                        >
                            &times;
                        </button>
                    </div>
                ))}

                <input
                    className={clsx(styles.input, error && styles.inputHasError)}
                    value={value}
                    placeholder={getLocalizedString('typeEmailAndPressEnter')}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onPaste={handlePaste}
                />

                {error && <p className={styles.error}>{error}</p>}
            </>
        </div>
    )
}

export default EmailPicker
