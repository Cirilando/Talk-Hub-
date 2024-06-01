import { Link } from 'react-router-dom';
import Avatar from './Icon';

const UserCard = ({ user, onClose }) => {
  return (
    <div>
      <Link 
        to={"/home/"+user?._id} 
        onClick={onClose} 
        className='flex items-center gap-3 p-2 md:p-4 border border-transparent hover:border-blue-500 rounded-xl cursor-pointer'
      >
        <div>
          <Avatar
            width={50}
            height={50}
            name={user?.name}
            // imageUrl={user?.profilePic}
            userId={user?._id}
          />
        </div>
        <div>
          <div className='font-semibold text-ellipsis line-clamp-1'>
            {user?.name}
          </div>
          <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
