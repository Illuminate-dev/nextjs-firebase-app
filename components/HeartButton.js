import {firestore, auth} from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { increment, doc, FieldValue, writeBatch } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';

export default function Heart({postRef}) {
    const heartRef = doc(postRef, 'hearts', auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);
    
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(firestore);

        batch.update(postRef, {heartCount: increment(1)});
        batch.set(heartRef, {uid});

        await batch.commit();
    };

    const removeHeart = async () => {
        const batch = writeBatch(firestore);



        batch.update(postRef, {heartCount: increment(-1)});
        batch.delete(heartRef);

        await batch.commit();
    }

    return heartDoc?.exists() ? (
        <button onClick={removeHeart}><FontAwesomeIcon icon={faHeartBroken} style={{color: "#FF0000"}}></FontAwesomeIcon> Unheart</button>
    ) : 
    (
        <button onClick={addHeart}><FontAwesomeIcon icon={faHeart} style={{color: "#FF0000"}}></FontAwesomeIcon>  Heart</button>
    );

}