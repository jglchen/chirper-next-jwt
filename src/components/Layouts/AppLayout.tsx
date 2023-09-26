import UserContextPage from '@/components/Layouts/UserContextPage';
import dynamic from 'next/dynamic';

interface PropsType {
    header?: React.ReactNode;
    children: React.ReactNode;
}

const AppLayout = ({ header, children }: PropsType) => {
    const Navigation = dynamic(() => import('./Navigation'), { ssr: false })

    return (
        <div className="min-h-screen bg-gray-100">
            <UserContextPage>
                <Navigation />

                {/* Page Heading */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>

                {/* Page Content */}
                <main>{children}</main>
            </UserContextPage>
        </div>
    )
}

export default AppLayout
