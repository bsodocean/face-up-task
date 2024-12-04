import { FC, useState } from "react";
import "./SubmitAlert.css";

interface SubmitAlertProps {
  addAlertEntry: (alert: { name: string; age: number; file: string }) => void;
}

const SubmitAlert: FC<SubmitAlertProps> = ({ addAlertEntry }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    file: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age, 10);
    if (isNaN(age)) return; // Guard against invalid age input
    const fileName = formData.file ? formData.file.name : "No file";
    addAlertEntry({ name: formData.name, age, file: fileName });
    setFormData({ name: "", age: "", file: null }); // Reset form after submission
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit} className='responsive-form'>
        <div className='form-field'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='form-field'>
          <label htmlFor='age'>Age</label>
          <input
            type='number'
            id='age'
            name='age'
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='form-field'>
          <label htmlFor='file'>Upload File</label>
          <input
            type='file'
            id='file'
            name='file'
            onChange={handleFileChange}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default SubmitAlert;
