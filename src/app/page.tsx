import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link className="flex justify-center items-center w-full h-screen text-8xl" href={"/posts"}>
        К постам
      </Link>
    </>
  );
}
