import { useState } from 'react';
import  { UploadDataProps } from '@/types';
import axios from 'axios';

function useUploadData() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const uploadData = async (props: UploadDataProps) => {
    setIsLoading(true);
    const formData = new FormData();

    if (props.image) formData.append('image', props.image);
    console.log({
      empId: props.empId,
      empshift: props.empshift,
      deptId: props.deptId,
      zone: props.zone,
      date: props.date,
      arrived_time: props.arrived_time,
    })

    formData.append('empInfo', JSON.stringify({
      empId: props.empId,
      empshift: props.empshift,
      deptId: props.deptId,
      zone: props.zone,
      date: props.date,
      arrived_time: props.arrived_time,
    }));

    try {
      const result = await axios.post('http://127.0.0.1:3000/api/entry', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
      });
      setResponse(result.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, uploadData };
}

export default useUploadData;