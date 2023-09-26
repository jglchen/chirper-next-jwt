import AppLayout from '@/components/Layouts/AppLayout';
import Head from 'next/head';
import ChirpsList from '@/components/ChirpsList';

const Chirps = () => {
    return (
        <AppLayout>
            <Head>
                <title>Chirps</title>
            </Head>
            <ChirpsList />
        </AppLayout>
    );

}    

export default Chirps;
