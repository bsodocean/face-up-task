import { FC, useState } from "react";
import "./SubmitAlert.css";

interface SubmitAlertProps {
  addAlertEntry: (alert: {
    name: string;
    age: number;
    description: string;
    file: string;
  }) => void;
}

const SubmitAlert: FC<SubmitAlertProps> = ({ addAlertEntry }) => {
  const [formData, setFormData] = useState<{
    name: string;
    age: string;
    description: string;
    file: File | null;
  }>({
    name: "",
    age: "",
    description: "",
    file: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age, 10);
    if (isNaN(age)) return;
    const fileName = formData.file ? formData.file.name : "No file";
    addAlertEntry({
      name: formData.name,
      age,
      description: formData.description,
      file: fileName,
    });
    setFormData({ name: "", age: "", description: "", file: null });
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
            placeholder='Enter your name'
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
            placeholder='Enter your age'
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
        <div className='form-field'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder='Enter a detailed description...'
            rows={4}
            cols={40}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default SubmitAlert;
