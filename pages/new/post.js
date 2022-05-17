/** @format */
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import PostForm from "../../components/forms/PostForm";
import Navbar from "../../components/navigation/Navbar";

export default function CreatePostPage() {
  return (
    <>
      <Head>
        <title>Create Post</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css"
          integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js"
          integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p"
          crossOrigin="anonymous"
        />
      </Head>
      <Navbar title="Crear un post" />
      <PostForm />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
