import ProfileScreen from '../../components/ProfileScreen';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function SelfProfile() {

  const { user_id} = useContext(AuthContext);

  return (
    <ProfileScreen user_id ={user_id} isSelf={true}/>
  );
}