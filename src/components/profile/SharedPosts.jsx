import Post from "../parts/Post"

function SharedPosts() {

  const userId = 1;


  return (
    <div className="d-flex flex-column gap-3">
    <Post
      key={`4634545654646`}
      id={6546}
      title={"post.title"}
      snippet={`
CREATE TABLE IF NOT EXISTS public.snippet
(
id integer NOT NULL DEFAULT nextval('snippet_id_seq'::regclass),
tiltle character varying(70) COLLATE pg_catalog."default" NOT NULL,
content text COLLATE pg_catalog."default" NOT NULL,
languge character varying(30) COLLATE pg_catalog."default" NOT NULL,
created_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
modified_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT snippet_pkey PRIMARY KEY (id)
)
`}
      description={"post.description"}
      posterId={1}
      language={"post.language"}
      likeCount={654}
      dislikeCount={4}
      commentCount={0}
      shareCount={56}
      isLiked={false}
      isDisliked={false}
      isSaved={false}
      isInterested={false}
      githubLink={null}
      firstname={"Bassem"}
      lastname={"Arfaoui"}
      username={"ArfBassem"}
    />
    <Post
      key={`4634545654646`}
      id={6546}
      title={"post.title"}
      snippet={`
CREATE TABLE IF NOT EXISTS public.snippet
(
id integer NOT NULL DEFAULT nextval('snippet_id_seq'::regclass),
tiltle character varying(70) COLLATE pg_catalog."default" NOT NULL,
content text COLLATE pg_catalog."default" NOT NULL,
languge character varying(30) COLLATE pg_catalog."default" NOT NULL,
created_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
modified_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT snippet_pkey PRIMARY KEY (id)
)
`}
      description={"post.description"}
      posterId={1}
      language={"post.language"}
      likeCount={654}
      dislikeCount={4}
      commentCount={0}
      shareCount={56}
      isLiked={false}
      isDisliked={false}
      isSaved={false}
      isInterested={false}
      githubLink={null}
      firstname={"Bassem"}
      lastname={"Arfaoui"}
      username={"ArfBassem"}
    />
    <Post
      key={`4634545654646`}
      id={6546}
      title={"post.title"}
      snippet={`
CREATE TABLE IF NOT EXISTS public.snippet
(
id integer NOT NULL DEFAULT nextval('snippet_id_seq'::regclass),
tiltle character varying(70) COLLATE pg_catalog."default" NOT NULL,
content text COLLATE pg_catalog."default" NOT NULL,
languge character varying(30) COLLATE pg_catalog."default" NOT NULL,
created_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
modified_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT snippet_pkey PRIMARY KEY (id)
)
`}
      description={"post.description"}
      posterId={1}
      language={"post.language"}
      likeCount={654}
      dislikeCount={4}
      commentCount={0}
      shareCount={56}
      isLiked={false}
      isDisliked={false}
      isSaved={false}
      isInterested={false}
      githubLink={null}
      firstname={"Bassem"}
      lastname={"Arfaoui"}
      username={"ArfBassem"}
    />
  </div>
  )
}

export default SharedPosts