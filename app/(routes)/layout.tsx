import Header from "@/src/layout/Header"

interface RoutesLayoutProps {
    children: React.ReactNode
}

const RoutesLayout = ({ children }: RoutesLayoutProps) => {
    return (
        <>
            <Header />
            <div>{children}</div>
        </>
    )
}

export default RoutesLayout