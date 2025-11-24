import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { Button } from '@mui/material';

const BackButton = ({ destination = '/' }) => {
  return (
    <div className='flex'>
      <Link to={destination}>
        <Button variant="outlined" startIcon={<BsArrowLeft />}color="primary">
            Back
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;