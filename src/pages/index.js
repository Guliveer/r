import Head from "next/head";
import {useEffect, useState} from "react";
import redirects from "../../public/redirects.json";

export default function Home() {
    const [target, setTarget] = useState(null);
    useEffect(() => {
        setTarget(redirects.default);
        if (redirects.default) {
            window.location.href = redirects.default;
            window.location.replace(redirects.default);
        } else {
            console.error("No default redirect found.");
            document.body.innerText = "Lost?";
        }
    }, []);

    return (
        <>
            <style>
                {`
                    body {
                        font-family: sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                `}
            </style>
            <Head>
                <title>Redirecting...</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                {target && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
            </Head>
            <div></div>
        </>
    );
}



