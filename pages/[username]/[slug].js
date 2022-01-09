import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import styles from '../../styles/Post.module.css'
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON, increment } from "../../lib/firebase";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHeart } from "@fortawesome/free-solid-svg-icons";


export async function getStaticProps({params}) {
  const {username, slug} = params;
  
  const userDoc = await getUserWithUsername(username);
  let post;
  let path;
  

  if(userDoc) {
    const postRef = doc(userDoc.ref, 'posts', slug);
    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: {
      post, path
    },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  
  const snapshot = await getDocs(collectionGroup(firestore, 'posts'));
  const paths = snapshot.docs.map((doc) => {
    const {slug, username } = doc.data();
    return {
      params: {username, slug},
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }

}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);


  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} <FontAwesomeIcon icon={faHeart} style={{color: "#FF0000"}}></FontAwesomeIcon></strong>
        </p>

        <AuthCheck fallback={
          <Link href="/enter">
            <button><FontAwesomeIcon icon={faHeart} style={{color: "#FF0000"}}></FontAwesomeIcon> Sign Up</button>
          </Link>
        }>
          <HeartButton postRef={postRef} />
        </AuthCheck>

      </aside>
    </main>
  )
}