import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { auth, firestore } from "../lib/firebase";

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin}/>) : null;
}

function PostItem({ post, admin = false}) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);


    const deletePost = async () => {
        const slug = post.slug;
        
        const ref = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug);
        await deleteDoc(ref);
    }

    return <div className="card">
        <Link href={`/${post.username}`}>
            <a>
                <strong>By @{post.username}</strong>
            </a>
        </Link>

        <Link href={`/${post.username}/${post.slug}`}>
            <h2>
                <a>{post.title}</a>
            </h2>
        </Link>

        {admin && (
        <>
          <div>
              <Link href={`/admin/${post.slug}`}>
                <h3>
                  <button className="btn-blue">Edit</button>
                </h3>
              </Link>
              <h3>
                  <button onClick={deletePost} className="btn-red">Delete Post</button>
              </h3>
          </div>
          {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
        </>
      )}

        <footer>
            <span>
                {wordCount} words. {minutesToRead} min read
            </span>
            <span><FontAwesomeIcon icon={faHeart} style={{color: "#FF0000"}}></FontAwesomeIcon>{post.heartCount}</span>
        </footer>

    </div>
}