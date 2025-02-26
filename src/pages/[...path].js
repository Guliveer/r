import { useEffect } from "react";
import Head from "next/head";
import redirects from "../../public/redirects.json";

export async function getStaticPaths() {
    const paths = Object.keys(redirects)
        .filter((key) => key !== "default")
        .map((key) => ({ params: { path: [key] } }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const target = redirects[params.path[0]] || null;
    return { props: { target } };
}

export default function Redirect({ target }) {
    useEffect(() => {
        if (target) {
            window.location.href = target;
            window.location.replace(target);
        }
    }, [target]);

    return (
        <>
            <Head>
                <title>Redirecting...</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <meta httpEquiv="refresh" content={`0;url=${target}`} />
            </Head>
            <div>
            Redirecting to:<br />
            {target}
            <br /><br />
            Click <a href={target}>here</a>, if you are not redirected automatically.
            </div>
        </>
    );
}
