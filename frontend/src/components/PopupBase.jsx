import "@styles/popup.css";
import CloseIcon from "@assets/XIcon.svg";

export default function PopupBase({ show, setShow, title, fields, onSubmit, buttonText }) {
    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} />
                        </button>
                        <h2>{title}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                            {fields.map((field, index) => (
                                <div key={index} className="form-group">
                                    <label>{field.label}</label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                    />
                                </div>
                            ))}
                            <button type="submit">{buttonText}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
