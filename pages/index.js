import Head from 'next/head'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { collectionGroup, limit, orderBy, query, startAfter, Timestamp, where, getDocs } from 'firebase/firestore';
import { firestore, postToJSON } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import { useState } from 'react';


const LIMIT = 5;

export async function getServerSideProps(context) {
  const postsQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT));
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return {
    props: {posts}
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    if(!last) {
      setPostsEnd(true);
      setLoading(false);
      return;
    }

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const q = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), startAfter(cursor), limit(LIMIT));

    const newPosts = (await getDocs(q)).docs.map((docs) => docs.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if(newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load More</button>}

      <Loader show = {loading} />

      {postsEnd && 'You have reached the end!'}

    </main>
  );
}
