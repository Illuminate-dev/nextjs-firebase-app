import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { collection, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { query as q} from 'firebase/firestore';
import Metatags from '../../components/Metatags'

export async function getServerSideProps({query}) {
  const {username} = query;

  const userDoc = await getUserWithUsername(username);

  if(!userDoc) {
    return {
      notFound: true
    }
  }

  let user = null;
  let posts = null;

  if(userDoc) {
    user = userDoc.data();
    const postsQuery = q(collection(userDoc.ref, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(5));
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
    
  }

  return {
    props: {user, posts},
  };
}

export default function UserProfilePage({user, posts }) {
  return (
    <main>
        <Metatags title={user.username} image={user.photoURL}/>
        <UserProfile user={user} />
        <PostFeed posts={posts} />
    </main>
  )
}