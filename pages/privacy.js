import Head from "next/head";

const PrivacyPage = () => {
    return (
        <>
            <Head>
                <title>Contacto || Apprendamos</title>
            </Head>
            <div className='prose dark:prose-invert mx-auto'>
                <h1 id="política-de-privacidad-de-datos">Política de privacidad de datos</h1>
                <p>Tu privacidad es importante para nosotros. Por ello, todos tus datos son almacenados en servidores de <a href="https://fauna.com/">Fauna</a>, una empresa que ofrece una de las bases de datos más seguras del mundo.</p>
                <p>A continuación te mostramos los términos que aceptas al usar Apprendamos.</p>
                <h2 id="los-datos-que-recopilamos">Los datos que recopilamos</h2>
                <p>Como parte de nuestra misión por hacer que la información académica sea de libre acceso a todos, los datos que recopilamos se dividen en los tres grupos detallados a continuación.</p>
                <h3 id="publicaciones">Publicaciones</h3>
                <p>Las publicaciones son</p>
            </div>
        </>
    );
};

export default PrivacyPage;